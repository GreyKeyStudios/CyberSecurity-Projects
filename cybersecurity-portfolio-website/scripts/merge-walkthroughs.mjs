#!/usr/bin/env node
/**
 * Extracts full project walkthrough JSON blocks from newnotesforcursor.md
 * and merges them into data/resources.json projectWalkthroughs.
 * Keeps soc-casefiles unchanged (no full version in doc).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");
const DOC_PATH = path.join(REPO_ROOT, "newnotesforcursor.md");
const RESOURCES_PATH = path.join(REPO_ROOT, "cybersecurity-portfolio-website/data/resources.json");

const WALKTHROUGH_IDS = [
  "wireshark",
  "log-analysis",
  "threat-intelligence",
  "firewall-setup",
  "ids-setup",
  "malware-analysis",
  "home-security-lab",
  "docker-security-lab",
];

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

function extractWalkthrough(mdContent, id) {
  const marker = `✅ projectWalkthroughs.${id}`;
  const idx = mdContent.indexOf(marker);
  if (idx === -1) return null;
  const jsonStr = extractJsonObject(mdContent, idx);
  if (!jsonStr) return null;
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error(`Failed to parse JSON for ${id}:`, e.message);
    return null;
  }
}

const mdContent = fs.readFileSync(DOC_PATH, "utf8");
const resources = JSON.parse(fs.readFileSync(RESOURCES_PATH, "utf8"));
const projectWalkthroughs = resources.projectWalkthroughs || {};

for (const id of WALKTHROUGH_IDS) {
  const walkthrough = extractWalkthrough(mdContent, id);
  if (walkthrough) {
    projectWalkthroughs[id] = walkthrough;
    console.log(`Merged walkthrough: ${id}`);
  } else {
    console.warn(`Could not extract walkthrough for: ${id}`);
  }
}

resources.projectWalkthroughs = projectWalkthroughs;
fs.writeFileSync(RESOURCES_PATH, JSON.stringify(resources, null, 2) + "\n", "utf8");
console.log("Done. resources.json updated.");
