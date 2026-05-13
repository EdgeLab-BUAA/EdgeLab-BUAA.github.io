#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const COVER_DIR = path.join(ROOT, "mainpage", "cover");
const OUTPUT_FILE = path.join(ROOT, "js", "cover-data.js");

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic"]);

const files = fs
  .readdirSync(COVER_DIR)
  .filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
  .sort()
  .map((f) => `./mainpage/cover/${f}`);

const content = `window.__LAB_COVER__ = ${JSON.stringify(files, null, 2)};\n`;

fs.writeFileSync(OUTPUT_FILE, content, "utf8");
console.log(`Wrote ${files.length} cover images to ${path.relative(ROOT, OUTPUT_FILE)}`);
