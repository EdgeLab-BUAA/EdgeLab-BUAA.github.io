#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, "highlighted-research");
const OUTPUT_DIR = path.join(SOURCE_DIR, "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "projects.json");

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

const resolveCover = (dir, info) => {
  if (info.cover_image) {
    const explicit = path.join(dir, info.cover_image);
    if (fs.existsSync(explicit)) {
      return path.relative(ROOT, explicit).replace(/\\/g, "/");
    }
  }

  const image = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(png|jpe?g|webp|gif)$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort()[0];

  if (!image) return "";
  return path.relative(ROOT, path.join(dir, image)).replace(/\\/g, "/");
};

const dirs = fs
  .readdirSync(SOURCE_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && /^P\d+$/i.test(entry.name))
  .map((entry) => entry.name)
  .sort();

const projects = dirs.map((dirName) => {
  const dir = path.join(SOURCE_DIR, dirName);
  const info = parseSimpleYaml(fs.readFileSync(path.join(dir, "info.yaml"), "utf8"));
  return {
    id: info.id || dirName,
    title: info.title || "",
    authors: info.authors || "",
    venue: info.venue || "",
    year: Number(info.year || 0),
    award: info.award || "",
    cover_image: resolveCover(dir, info)
  };
});

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(
  OUTPUT_FILE,
  `${JSON.stringify({ generated_at: new Date().toISOString(), projects }, null, 2)}\n`,
  "utf8"
);

console.log(`Wrote ${projects.length} projects to ${path.relative(ROOT, OUTPUT_FILE)}`);
