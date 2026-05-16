import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const mdDir = path.join(root, "publications", "md");
const outputFile = path.join(mdDir, "markdown-manifest.js");

const escapeJs = (value) =>
  JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e");

const entries = {};
const items = await fs.readdir(mdDir, { withFileTypes: true });

for (const item of items) {
  if (!item.isFile() || !item.name.endsWith(".md")) continue;
  const absolutePath = path.join(mdDir, item.name);
  const relativePath = `md/${item.name}`;
  const publicationRelativePath = `publications/md/${item.name}`;
  const content = await fs.readFile(absolutePath, "utf8");
  entries[relativePath] = content;
  entries[`./${relativePath}`] = content;
  entries[publicationRelativePath] = content;
}

const output = `window.__LAB_MARKDOWN__ = ${escapeJs(entries)};\n`;
await fs.writeFile(outputFile, output, "utf8");
