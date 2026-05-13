#!/usr/bin/env node
// Run from repo root: node js/build-activities.js

const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const PHOTOS_DIR = path.join(ROOT, "activities", "photos");
const OUTPUT_DIR = path.join(ROOT, "activities", "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "photos.json");

const parseValue = (raw) => {
  const value = raw.trim();
  if (value === "") return "";
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?\d+$/.test(value)) return Number(value);
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
};

const parseSimpleYaml = (source) => {
  const data = {};
  source.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const idx = line.indexOf(":");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const rawValue = line.slice(idx + 1);
    data[key] = parseValue(rawValue);
  });
  return data;
};

const photoDirs = fs
  .readdirSync(PHOTOS_DIR, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();

const photos = photoDirs.map((dirName) => {
  const photoDir = path.join(PHOTOS_DIR, dirName);
  const infoPath = path.join(photoDir, "info.yaml");
  if (!fs.existsSync(infoPath)) throw new Error(`Missing info.yaml in ${photoDir}`);

  const info = parseSimpleYaml(fs.readFileSync(infoPath, "utf8"));

  const imgRaw = info.image || "";
  let image = "";
  if (imgRaw) {
    const abs = path.isAbsolute(imgRaw) ? imgRaw : path.join(ROOT, imgRaw);
    image = fs.existsSync(abs) ? path.relative(ROOT, abs).replace(/\\/g, "/") : imgRaw;
  }

  return {
    id: info.id || dirName,
    title_en: info.title_en || "",
    title_zh: info.title_zh || "",
    location_en: info.location_en || "",
    location_zh: info.location_zh || "",
    date: info.date || "",
    photographer: info.photographer || "",
    image,
    height: Number(info.height || 360),
  };
});

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(
  OUTPUT_FILE,
  JSON.stringify({ generated_at: new Date().toISOString(), photos }, null, 2),
  "utf8"
);

console.log(`Built ${photos.length} photos → ${path.relative(ROOT, OUTPUT_FILE)}`);
