#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const NEWS_DIR = path.join(ROOT, "news");
const OUTPUT_DIR = path.join(NEWS_DIR, "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "news.json");

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

const normalizeDate = (info) => {
  return String(info.date || info.published_at || info.year || info.group || "").trim();
};

const resolveImage = (dir, info) => {
  const explicit = info.image || info.cover_image || "";
  if (explicit) {
    const abs = path.isAbsolute(explicit) ? explicit : path.join(ROOT, explicit);
    const local = fs.existsSync(abs) ? abs : path.join(dir, explicit);
    if (fs.existsSync(local)) return path.relative(ROOT, local).replace(/\\/g, "/");
  }

  const candidate = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(png|jpe?g|webp|gif)$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort()[0];

  if (!candidate) return "";
  return path.relative(ROOT, path.join(dir, candidate)).replace(/\\/g, "/");
};

const guessType = (id, info) => {
  if (info.type) return String(info.type);
  if (/^A\d+/i.test(id)) return "Activity";
  if (/^P\d+/i.test(id)) return "Publication";
  return "News";
};

const guessLink = (id, info, image) => {
  const directLink =
    info.link ||
    info.url ||
    info.paper_link ||
    info.code_link ||
    info.book_link ||
    info.scholar_link ||
    "";
  if (directLink) return String(directLink);
  if (/^A\d+/i.test(id)) return `./activities.html#${id}`;
  if (/^P\d+/i.test(id)) return `./publication./publications/publications.html#${id}`;
  return image ? `./${image}` : "./news.html";
};

const buildExcerpt = (info) => {
  const candidates = [
    info.summary,
    info.description,
    info.abstract,
    info.venue,
    info.location_en,
    info.location_zh,
    info.location,
    info.authors
  ]
    .map((item) => String(item || "").trim())
    .filter(Boolean);

  const excerpt = candidates[0] || "";
  return excerpt.length > 220 ? `${excerpt.slice(0, 217).trimEnd()}...` : excerpt;
};

const buildTitle = (dirName, info) => {
  return (
    info.news_title ||
    info.title_en ||
    info.title_zh ||
    info.title ||
    info.name ||
    dirName
  );
};

const dirs = fs
  .readdirSync(NEWS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const items = dirs.map((dirName) => {
  const dir = path.join(NEWS_DIR, dirName);
  const infoPath = path.join(dir, "info.yaml");
  if (!fs.existsSync(infoPath)) {
    throw new Error(`Missing info.yaml in ${dir}`);
  }

  const info = parseSimpleYaml(fs.readFileSync(infoPath, "utf8"));
  const id = info.id || dirName;
  const image = resolveImage(dir, info);

  return {
    id,
    type: guessType(id, info),
    title: buildTitle(dirName, info),
    title_en: info.title_en || "",
    title_zh: info.title_zh || "",
    excerpt: buildExcerpt(info),
    date: normalizeDate(info),
    image,
    link: guessLink(id, info, image)
  };
});

items.sort((a, b) => String(b.date).localeCompare(String(a.date)) || a.id.localeCompare(b.id));

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(
  OUTPUT_FILE,
  `${JSON.stringify({ generated_at: new Date().toISOString(), items }, null, 2)}\n`,
  "utf8"
);

console.log(`Wrote ${items.length} news items to ${path.relative(ROOT, OUTPUT_FILE)}`);
