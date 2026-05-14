#!/usr/bin/env node
// Run from repo root: node js/build-highlighted-research.js

const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const BASE_DIR  = path.join(ROOT, "mainpage", "highlighted-research");
const IMGS_DIR  = path.join(BASE_DIR, "imgs");
const DATA_FILE = path.join(BASE_DIR, "data", "projects.json");
const JS_FALLBACK = path.join(ROOT, "js", "highlighted-projects-data.js");

const resolveCoverImage = (raw) => {
  if (!raw) return "";
  // Already a full path that exists — keep as-is
  if (fs.existsSync(path.join(ROOT, raw))) return raw;
  // Bare filename → look in imgs/
  const candidate = path.join(IMGS_DIR, path.basename(raw));
  if (fs.existsSync(candidate)) {
    return path.relative(ROOT, candidate).replace(/\\/g, "/");
  }
  return raw;
};

const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

data.projects = data.projects.map((p) => ({
  ...p,
  cover_image: resolveCoverImage(p.cover_image),
}));

data.generated_at = new Date().toISOString();

fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2) + "\n", "utf8");
fs.writeFileSync(
  JS_FALLBACK,
  `window.__LAB_HIGHLIGHTED_PROJECTS__ = ${JSON.stringify(data, null, 2)};\n`,
  "utf8"
);

console.log(`Updated ${data.projects.length} projects → ${path.relative(ROOT, DATA_FILE)}`);
console.log(`Regenerated ${path.relative(ROOT, JS_FALLBACK)}`);
