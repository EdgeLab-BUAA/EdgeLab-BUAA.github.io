#!/usr/bin/env node
// Run from repo root: node js/serve.js
// Opens the lab homepage on http://localhost:8080

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = 8080;
const ROOT = process.cwd();

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".heic": "image/heic",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";

  const filePath = path.join(ROOT, urlPath);

  // Directory listing (enables auto-discovery of cover images)
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    const entries = fs.readdirSync(filePath);
    const links = entries
      .map((name) => `  <a href="${encodeURIComponent(name)}">${name}</a>`)
      .join("\n");
    const html = `<!DOCTYPE html><html><body>\n${links}\n</body></html>\n`;
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
    return;
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": mime });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`\nLab homepage running at http://localhost:${PORT}\n`);
  console.log("Add photos to mainpage/cover/ — they appear automatically on reload.");
  console.log("Press Ctrl+C to stop.\n");
});
