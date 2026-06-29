#!/usr/bin/env node
/**
 * Exports the four v3 walkthroughs from resources.json into a single file (and
 * optional per-walkthrough files) so you can paste them into ChatGPT for verification.
 * Usage: node scripts/export-v3-for-review.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESOURCES_PATH = path.join(__dirname, "..", "data", "resources.json");
const OUT_FILE = path.join(__dirname, "..", "data", "v3-walkthroughs-for-review.json");
const OUT_DIR = path.join(__dirname, "..", "data", "v3-for-review");

const ids = ["soc-casefiles", "ids-setup", "malware-analysis", "home-security-lab"];

const data = JSON.parse(fs.readFileSync(RESOURCES_PATH, "utf8"));
const pw = data.projectWalkthroughs || {};

const subset = {};
for (const id of ids) {
  if (pw[id]) subset[id] = pw[id];
}

const json = JSON.stringify(subset, null, 2);
fs.writeFileSync(OUT_FILE, json + "\n", "utf8");
console.log(`Wrote ${Object.keys(subset).length} walkthroughs to ${OUT_FILE}`);

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
for (const id of ids) {
  if (subset[id]) {
    const p = path.join(OUT_DIR, `${id}.json`);
    fs.writeFileSync(p, JSON.stringify(subset[id], null, 2) + "\n", "utf8");
    console.log(`  ${p}`);
  }
}

const lines = json.split("\n").length;
console.log(`Single file: ${lines} lines. If too big for one paste, use the 4 files in data/v3-for-review/`);
