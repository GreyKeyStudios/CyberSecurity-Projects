#!/usr/bin/env node
/**
 * Extracts walkthrough JSON from newernotes.md and new notes.md into
 * scripts/walkthrough-updates/*.json for merge-v3-walkthroughs.mjs.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "../..");
const NEWER = path.join(REPO, "newernotes.md");
const NEW_NOTES = path.join(REPO, "new notes.md");
const OUT_DIR = path.join(__dirname, "walkthrough-updates");

function extractJsonObject(str, startIndex) {
  let i = str.indexOf("{", startIndex);
  if (i === -1) return null;
  let depth = 0;
  let inString = false;
  let escape = false;
  let quote = null;
  const start = i;
  for (; i < str.length; i++) {
    const c = str[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (inString) {
      if (c === "\\") escape = true;
      else if (c === quote) inString = false;
      continue;
    }
    if (c === '"' || c === "'") {
      inString = true;
      quote = c;
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return str.slice(start, i + 1);
    }
  }
  return null;
}

function extractById(content, id) {
  const needle = `"id": "${id}"`;
  const idx = content.indexOf(needle);
  if (idx === -1) return null;
  const obj = extractJsonObject(content, Math.max(0, idx - 50));
  if (!obj) return null;
  try {
    return JSON.parse(obj);
  } catch (e) {
    console.error(`Parse error for ${id}:`, e.message);
    return null;
  }
}

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const newerContent = fs.existsSync(NEWER) ? fs.readFileSync(NEWER, "utf8") : "";
const newNotesContent = fs.existsSync(NEW_NOTES) ? fs.readFileSync(NEW_NOTES, "utf8") : "";

const soc = extractById(newerContent, "soc-casefiles");
if (soc) {
  fs.writeFileSync(path.join(OUT_DIR, "soc-casefiles.json"), JSON.stringify(soc, null, 2) + "\n");
  console.log("Wrote soc-casefiles.json");
} else console.warn("Could not extract soc-casefiles");

for (const id of ["ids-setup", "malware-analysis", "home-security-lab"]) {
  const obj = extractById(newNotesContent, id);
  if (obj) {
    fs.writeFileSync(path.join(OUT_DIR, `${id}.json`), JSON.stringify(obj, null, 2) + "\n");
    console.log(`Wrote ${id}.json`);
  } else console.warn(`Could not extract ${id}`);
}

console.log("Done. Run node merge-v3-walkthroughs.mjs to apply.");
