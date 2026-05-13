#!/usr/bin/env node
// Run from repo root: node js/build-people.js

const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const MEMBERS_DIR = path.join(ROOT, "people", "members");
const OUTPUT_DIR = path.join(ROOT, "people", "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "members.json");

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

const TEAM_ORDER = { faculty: 0, team1: 1, team2: 2, team3: 3, alumni: 4 };

const memberDirs = fs
  .readdirSync(MEMBERS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const members = memberDirs.map((dirName) => {
  const memberDir = path.join(MEMBERS_DIR, dirName);
  const infoPath = path.join(memberDir, "info.yaml");
  if (!fs.existsSync(infoPath)) {
    throw new Error(`Missing info.yaml in ${memberDir}`);
  }

  const info = parseSimpleYaml(fs.readFileSync(infoPath, "utf8"));

  const photoRaw = info.photo || "";
  let photo = "";
  if (photoRaw) {
    const absPhoto = path.isAbsolute(photoRaw)
      ? photoRaw
      : path.join(ROOT, photoRaw);
    photo = fs.existsSync(absPhoto)
      ? path.relative(ROOT, absPhoto).replace(/\\/g, "/")
      : photoRaw;
  }

  return {
    id: info.id || dirName,
    name_en: info.name_en || "",
    name_zh: info.name_zh || "",
    role_en: info.role_en || "",
    role_zh: info.role_zh || "",
    team: info.team || "team1",
    research_en: info.research_en || "",
    research_zh: info.research_zh || "",
    photo,
    email: info.email || "",
    github: info.github || "",
    scholar: info.scholar || "",
    homepage: info.homepage || "",
    note_en: info.note_en || "",
    note_zh: info.note_zh || "",
  };
});

members.sort((a, b) => {
  const ta = TEAM_ORDER[a.team] ?? 99;
  const tb = TEAM_ORDER[b.team] ?? 99;
  if (ta !== tb) return ta - tb;
  return a.id.localeCompare(b.id);
});

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(
  OUTPUT_FILE,
  JSON.stringify({ generated_at: new Date().toISOString(), members }, null, 2),
  "utf8"
);

console.log(`Built ${members.length} members → ${path.relative(ROOT, OUTPUT_FILE)}`);
