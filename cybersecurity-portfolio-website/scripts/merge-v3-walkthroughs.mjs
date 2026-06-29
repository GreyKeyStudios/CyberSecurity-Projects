#!/usr/bin/env node
/**
 * Applies v3 walkthrough updates to data/resources.json projectWalkthroughs.
 * If a JSON file is missing in walkthrough-updates/, extracts from new notes.md or newernotes.md.
 * Merges Version B bits into soc-casefiles (title, successCriteria, NIST ref, cli, Step 8).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");
const UPDATES_DIR = path.join(__dirname, "walkthrough-updates");
const RESOURCES_PATH = path.join(__dirname, "..", "data", "resources.json");
const NEW_NOTES = path.join(REPO_ROOT, "new notes.md");
const NEWER_NOTES = path.join(REPO_ROOT, "newernotes.md");

const ids = ["soc-casefiles", "ids-setup", "malware-analysis", "home-security-lab"];

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

function extractFromMd(id) {
  if (id === "soc-casefiles") {
    if (!fs.existsSync(NEWER_NOTES)) return null;
    const md = fs.readFileSync(NEWER_NOTES, "utf8");
    const idx = md.indexOf('"id": "soc-casefiles"');
    if (idx === -1) return null;
    const start = md.lastIndexOf("{", idx);
    const jsonStr = extractJsonObject(md, start >= 0 ? start : idx - 2);
    if (!jsonStr) return null;
    try {
      return JSON.parse(jsonStr);
    } catch {
      return null;
    }
  }
  if (!fs.existsSync(NEW_NOTES)) return null;
  const md = fs.readFileSync(NEW_NOTES, "utf8");
  const idx = md.indexOf(`"id": "${id}"`);
  if (idx === -1) return null;
  const start = md.lastIndexOf("{", idx);
  const jsonStr = extractJsonObject(md, start >= 0 ? start : idx - 2);
  if (!jsonStr) return null;
  try {
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

function mergeSocCasefilesB(soc) {
  soc.title = "SOC Casefiles (Incident Documentation Pack)";
  if (!soc.successCriteria.includes("Casefiles are readable without extra explanation")) {
    soc.successCriteria.push("Casefiles are readable without extra explanation");
  }
  if (!soc.successCriteria.includes("Documentation style is consistent across the folder")) {
    soc.successCriteria.push("Documentation style is consistent across the folder");
  }
  const hasNIST = soc.references.some((r) => r.url && r.url.includes("800-61"));
  if (!hasNIST) {
    soc.references.unshift({
      title: "NIST Computer Security Incident Handling Guide (SP 800-61)",
      url: "https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final",
    });
  }
  const hasNslookup = soc.cliCheatSheet.some((c) => c.command && c.command.includes("nslookup"));
  if (!hasNslookup) {
    soc.cliCheatSheet.push({
      command: "nslookup example.com",
      syntax: "nslookup <domain>",
      purpose: "Resolves a domain and can be used to verify DNS behavior during investigations.",
    });
  }
  const hasCurl = soc.cliCheatSheet.some((c) => c.command && c.command.includes("curl"));
  if (!hasCurl) {
    soc.cliCheatSheet.push({
      command: "curl -I https://example.com",
      syntax: "curl -I <url>",
      purpose: "Pulls response headers to quickly inspect redirects, server type, and cache behavior.",
    });
  }
  const step8 = soc.steps && soc.steps[7];
  if (step8 && step8.title && step8.title.includes("Conclusion")) {
    step8.body =
      step8.body +
      "\n\nAdd **Decision** (True Positive / False Positive / Benign Positive / Suspicious) and **Reason** (2–4 bullet points explaining why).";
  }
  return soc;
}

if (!fs.existsSync(UPDATES_DIR)) fs.mkdirSync(UPDATES_DIR, { recursive: true });

const data = JSON.parse(fs.readFileSync(RESOURCES_PATH, "utf8"));
const pw = data.projectWalkthroughs || {};

for (const id of ids) {
  const p = path.join(UPDATES_DIR, `${id}.json`);
  let obj = null;
  if (fs.existsSync(p)) {
    obj = JSON.parse(fs.readFileSync(p, "utf8"));
  } else {
    obj = extractFromMd(id);
    if (obj) {
      fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf8");
      console.log(`Extracted ${id} from md and wrote to ${p}`);
    }
  }
  if (!obj) {
    console.warn(`Skip ${id}: no JSON file and could not extract from md`);
    continue;
  }
  if (id === "soc-casefiles") obj = mergeSocCasefilesB(obj);
  pw[id] = obj;
  console.log(`Applied: ${id}`);
}

data.projectWalkthroughs = pw;
fs.writeFileSync(RESOURCES_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log("Done. resources.json updated.");
