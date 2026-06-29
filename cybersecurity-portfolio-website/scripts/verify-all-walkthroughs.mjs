import fs from "fs";

const RESOURCES = "data/resources.json";
// If you prefer checking an export file instead, replace RESOURCES with:
// const RESOURCES = "cybersecurity-portfolio-website/data/v3-walkthroughs-for-review.json";

const raw = fs.readFileSync(RESOURCES, "utf8");
const data = JSON.parse(raw);

const projectWalkthroughs = data.projectWalkthroughs || {};
const expectedIds = [
  "soc-casefiles",
  "log-analysis",
  "threat-intelligence",
  "wireshark",
  "firewall-setup",
  "ids-setup",
  "malware-analysis",
  "home-security-lab",
  "docker-security-lab",
];

// --- “Agreed version” expectations (tune these if you want stricter/looser) ---
// These are *heuristics*, because we don’t have an explicit `version` field.
const EXPECT = {
  "wireshark": { minSteps: 10, mustHave: ["cliCheatSheet", "references", "troubleshooting"] }, // you said v2 = 12 steps
  "log-analysis": { minSteps: 8, mustHave: ["cliCheatSheet", "references", "troubleshooting"] },
  "threat-intelligence": { minSteps: 7, mustHave: ["cliCheatSheet", "references", "troubleshooting"] },
  "firewall-setup": { minSteps: 7, mustHave: ["cliCheatSheet", "references", "troubleshooting"] },
  "docker-security-lab": { minSteps: 8, mustHave: ["cliCheatSheet", "references", "troubleshooting"] },
  "ids-setup": { minSteps: 8, mustHave: ["cliCheatSheet", "references", "troubleshooting"] },
  "malware-analysis": { minSteps: 8, mustHave: ["cliCheatSheet", "references", "troubleshooting"] },
  "home-security-lab": { minSteps: 8, mustHave: ["cliCheatSheet", "references", "troubleshooting"] },
  // casefiles is special: could still be lighter, but you wanted it redone too.
  "soc-casefiles": { minSteps: 6, mustHave: ["references"] },
};

const REQUIRED_TOP = [
  "id","title","difficulty","timeEstimate","tools","prereqs","objective","deliverables","steps","successCriteria"
];

function fail(msg) {
  console.log("❌ " + msg);
  process.exitCode = 1;
}
function warn(msg) {
  console.log("⚠️  " + msg);
}
function ok(msg) {
  console.log("✅ " + msg);
}
function isNonEmptyString(x) {
  return typeof x === "string" && x.trim().length > 0;
}

function hasCommandLikeText(s) {
  return /```|(^|\n)\s*\$ |(^|\n)\s*(sudo|apt|dnf|yum|brew|choco|winget|docker|docker-compose|compose|nmap|tcpdump|tshark|wireshark|suricata|snort|ufw|iptables|powershell|Get-|Set-|Invoke-|curl|wget|python|pip|venv)\b/mi.test(s);
}
function hasValidationMarkers(s) {
  return /(Validation|Verify|What success looks like|Expected output|You should see)/i.test(s);
}
function hasTroubleshootingMarkers(s) {
  return /(Troubleshoot|If you get|Common errors|If it fails|Fix:)/i.test(s);
}

function normalizeWalkthrough(w) {
  // Some people store steps as strings; your UI expects objects.
  // If it’s strings, we flag it hard.
  return w;
}

function checkWalkthrough(id, w) {
  console.log("\n==============================");
  console.log(`Checking: ${id}`);

  if (!w) {
    fail(`${id}: missing from projectWalkthroughs`);
    return;
  }

  // Required fields
  for (const k of REQUIRED_TOP) {
    if (!(k in w)) fail(`${id}: missing required field "${k}"`);
  }

  if (w.id !== id) warn(`${id}: walkthrough.id "${w.id}" does not match key "${id}" (should match).`);

  if (!isNonEmptyString(w.title)) fail(`${id}: title empty`);
  if (!Array.isArray(w.tools) || w.tools.length === 0) fail(`${id}: tools must be non-empty array`);
  if (!Array.isArray(w.prereqs) || w.prereqs.length === 0) fail(`${id}: prereqs must be non-empty array`);
  if (!Array.isArray(w.deliverables) || w.deliverables.length === 0) fail(`${id}: deliverables must be non-empty array`);
  if (!Array.isArray(w.successCriteria) || w.successCriteria.length === 0) fail(`${id}: successCriteria must be non-empty array`);

  // Steps
  if (!Array.isArray(w.steps) || w.steps.length === 0) {
    fail(`${id}: steps must be non-empty array`);
    return;
  }

  // Steps must be objects with title/body
  let anyStepBad = false;
  w.steps.forEach((s, idx) => {
    if (typeof s !== "object" || s === null) {
      anyStepBad = true;
      fail(`${id}: step[${idx}] is not an object (should be {title, body})`);
      return;
    }
    if (!isNonEmptyString(s.title)) {
      anyStepBad = true;
      fail(`${id}: step[${idx}] missing/empty title`);
    }
    if (!isNonEmptyString(s.body)) {
      anyStepBad = true;
      fail(`${id}: step[${idx}] missing/empty body`);
    }
  });
  if (anyStepBad) return;

  // Heuristics for “full rebuildable”
  const bodyText = w.steps.map(s => s.body).join("\n\n");
  const cmdOK = hasCommandLikeText(bodyText);
  const valOK = hasValidationMarkers(bodyText);
  const tsOK  = hasTroubleshootingMarkers(bodyText);

  if (!cmdOK) warn(`${id}: step bodies don’t show obvious copy/paste commands or code fences (might still be checklist-y).`);
  else ok(`${id}: has command/code-looking content.`);

  if (!valOK) warn(`${id}: no obvious validation markers (add “Validation / Expected output / Verify”).`);
  else ok(`${id}: has validation markers.`);

  // Troubleshooting can be in a separate section or in-step
  const hasTroubleshootingSection = Array.isArray(w.troubleshooting) && w.troubleshooting.length > 0;
  if (!tsOK && !hasTroubleshootingSection) warn(`${id}: no obvious troubleshooting markers and troubleshooting[] is empty/missing.`);
  else ok(`${id}: troubleshooting present (in-step or section).`);

  // Section checks
  const expect = EXPECT[id] || {};
  if (expect.minSteps && w.steps.length < expect.minSteps) {
    warn(`${id}: steps=${w.steps.length} is below expected minSteps=${expect.minSteps}.`);
  }

  if (expect.mustHave) {
    for (const sec of expect.mustHave) {
      if (!(sec in w)) warn(`${id}: missing expected section "${sec}".`);
      else if (!Array.isArray(w[sec]) || w[sec].length === 0) warn(`${id}: "${sec}" exists but is empty.`);
      else ok(`${id}: "${sec}" has ${w[sec].length} item(s).`);
    }
  }

  // Duplicate step titles check (paste mistakes)
  const titles = w.steps.map(s => s.title.trim());
  const unique = new Set(titles);
  if (unique.size !== titles.length) warn(`${id}: duplicate step titles detected (possible duplication/paste issue).`);

  ok(`${id}: done — steps=${w.steps.length}`);
}

// --- Run ---
console.log("Verifying walkthroughs in:", RESOURCES);

for (const id of expectedIds) {
  checkWalkthrough(id, normalizeWalkthrough(projectWalkthroughs[id]));
}

// Extra: detect unexpected walkthrough keys
const extra = Object.keys(projectWalkthroughs).filter(k => !expectedIds.includes(k));
if (extra.length) warn(`Extra walkthrough keys found (not in the 9 expected ids): ${extra.join(", ")}`);

console.log("\nFinished.");
if (process.exitCode === 1) {
  console.log("\nResult: ❌ Some walkthroughs are missing required parts or schema.");
} else {
  console.log("\nResult: ✅ No hard failures. Review warnings for “version/meat” gaps.");
}
