#!/usr/bin/env node
// Run from repo root: node js/build-workshops.js

const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const WORKSHOP_DIR = path.join(ROOT, "activities", "workshop");
const OUTPUT_DIR = path.join(ROOT, "workshops", "data");
const OUTPUT_JSON = path.join(OUTPUT_DIR, "workshops.json");
const OUTPUT_JS = path.join(ROOT, "js", "workshops-data.js");

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic"]);

const formatTitle = (dirName) =>
  dirName
    .split("-")
    .map((part) => (/^\d{4}$/.test(part) ? part : part.toUpperCase()))
    .join(" ");

const parseDate = (dirName) => {
  const m = dirName.match(/(\d{4})/);
  return m ? m[1] : "";
};

const eventDirs = fs
  .readdirSync(WORKSHOP_DIR, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();

let counter = 1;
const photos = [];

eventDirs.forEach((eventDir) => {
  const eventPath = path.join(WORKSHOP_DIR, eventDir);
  const title = formatTitle(eventDir);
  const date = parseDate(eventDir);

  const files = fs
    .readdirSync(eventPath)
    .filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
    .sort();

  files.forEach((file) => {
    const id = `W${String(counter).padStart(3, "0")}`;
    counter++;
    photos.push({
      id,
      event: eventDir,
      title_en: title,
      title_zh: title,
      location_en: "",
      location_zh: "",
      date,
      photographer: "",
      image: `activities/workshop/${eventDir}/${file}`,
      height: 360,
    });
  });
});

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(
  OUTPUT_JSON,
  JSON.stringify({ generated_at: new Date().toISOString(), photos }, null, 2),
  "utf8"
);

const jsContent = `window.__LAB_WORKSHOPS__ = ${JSON.stringify({ generated_at: new Date().toISOString(), photos }, null, 2)};\n`;
fs.writeFileSync(OUTPUT_JS, jsContent, "utf8");

console.log(`Built ${photos.length} workshop photos from ${eventDirs.length} events → workshops/data/workshops.json + js/workshops-data.js`);
