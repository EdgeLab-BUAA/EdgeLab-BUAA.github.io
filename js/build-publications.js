#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const PAPERS_DIR = path.join(ROOT, "publications", "papers");
const OUTPUT_DIR = path.join(ROOT, "publications", "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "papers.json");

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

const resolveCover = (paperDir, info) => {
  if (!info.cover_image) return "";
  const coverPath = path.join(paperDir, info.cover_image);
  if (!fs.existsSync(coverPath)) return "";
  return path.relative(ROOT, coverPath).replace(/\\/g, "/");
};

const paperDirs = fs
  .readdirSync(PAPERS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const papers = paperDirs.map((dirName) => {
  const paperDir = path.join(PAPERS_DIR, dirName);
  const infoPath = path.join(paperDir, "info.yaml");
  if (!fs.existsSync(infoPath)) {
    throw new Error(`Missing info.yaml in ${paperDir}`);
  }

  const info = parseSimpleYaml(fs.readFileSync(infoPath, "utf8"));
  return {
    id: info.id || dirName,
    group: info.group || String(info.year || ""),
    title: info.title || "",
    authors: info.authors || "",
    venue: info.venue || "",
    year: Number(info.year || 0),
    citations: Number(info.citations || 0),
    scholar_link: info.scholar_link || "",
    paper_link: info.paper_link || "",
    code_link: info.code_link || "",
    book_link: info.book_link || "",
    award: info.award || "",
    featured: Boolean(info.featured),
    cover_image: resolveCover(paperDir, info)
  };
});

papers.sort((a, b) => {
  if (b.year !== a.year) return b.year - a.year;
  return a.id.localeCompare(b.id);
});

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(
  OUTPUT_FILE,
  `${JSON.stringify({ generated_at: new Date().toISOString(), papers }, null, 2)}\n`,
  "utf8"
);

console.log(`Wrote ${papers.length} papers to ${path.relative(ROOT, OUTPUT_FILE)}`);
