# Full Breakdown for ChatGPT — CyberSecurity-Projects & SOC OS

**Use this doc when you need to generate content for the portfolio/SOC OS site (walkthroughs, runbooks, app copy, tickets, etc.). Copy the whole thing or the sections you need.**

---

## 1. What This Is

- **Repo:** CyberSecurity-Projects — a portfolio repo that doubles as a **SOC training environment**. Real project folders (casefiles, Splunk lab, Wireshark, etc.) live next to the website code.
- **Website:** A Next.js app that presents a **“SOC OS”** — a fake desktop with icons. Clicking an icon opens an “app” (Templates, Tickets, Projects, Log Viewer, Cert Roadmap, etc.). Most content is driven by **one big JSON file** (`resources.json`). There is no separate backend; state is localStorage or Supabase where noted.
- **Goal:** Visitors (and the owner) can **rebuild labs from walkthroughs**, practice with tickets/runbooks, and use the site as a “second brain” for redoing projects later.

---

## 2. Repo Structure (High Level)

- **Project/lab folders (9):** Each has a walkthrough in the site. These are the only things that get **projectWalkthroughs**.
- **Other content folders:** 00-Start-Here, Code-Examples, Interview-Prep, Templates, SOC_Notes — used by the site but are **not** “projects” for walkthrough purposes.
- **Website:** `cybersecurity-portfolio-website/` — Next.js app; main VM UI is in `app/resources/page.tsx`; data in `data/resources.json` and `data/projects.json`.

---

## 3. The 9 Projects/Labs (Folder → ID)

| Repo folder                 | projects.json **id**   | Notes                          |
|----------------------------|------------------------|--------------------------------|
| SOC-Casefiles/             | soc-casefiles          | Case files & playbooks         |
| Log-Analysis/              | log-analysis           | Splunk / syslog lab            |
| Threat-Intelligence/       | threat-intelligence    | IOC enrichment Python tool     |
| Wireshark-Packet-Capture/  | wireshark              | Packet capture lab             |
| Firewall-Setup/            | firewall-setup         | UFW / hardening lab            |
| IDS_Setup/                 | ids-setup              | IDS (Suricata/Snort) lab       |
| Malware-Analysis/          | malware-analysis       | Malware triage lab             |
| Home-Security-Lab/         | home-security-lab     | Home network baseline lab      |
| Docker-Security-Lab/       | docker-security-lab   | Docker + DVWA security lab     |

- **projects.json** holds: `id`, `title`, `category`, `description`, `githubPath`, `link`, `badge`, `evidence`, etc. The **id** is the key used in **projectWalkthroughs** in resources.json.
- **Do not** add walkthroughs for: 00-Start-Here, Code-Examples, Interview-Prep, Templates, SOC_Notes, or the website folder itself.

---

## 4. Where Data Lives

- **`cybersecurity-portfolio-website/data/resources.json`**  
  - Single source for almost all VM content: templates, case files, playbooks, **projectWalkthroughs**, **projectsWalkthrough** (repo-level), tickets, runbooks, log samples, CLI commands, cert path, lab files, **appIntros**, threat feed, toolbox, glossary, skill drills, mini games, etc.
- **`cybersecurity-portfolio-website/data/projects.json`**  
  - List of the 9 projects with `id`, `title`, `category`, `description`, `githubPath`, `link`, `badge`, `evidence`, etc. Used by the Projects app and by project detail pages.

---

## 5. Project Walkthroughs (projectWalkthroughs)

- **Location:** `resources.json` → `projectWalkthroughs` — object keyed by **project id** (e.g. `wireshark`, `log-analysis`, `soc-casefiles`).
- **Purpose:** Step-by-step, “rebuildable” lab guides. Someone with no context can follow them to recreate the project.

**Required shape per project:**

```json
{
  "id": "wireshark",
  "title": "Wireshark Packet Capture",
  "difficulty": "Beginner → Intermediate",
  "timeEstimate": "2–4 hours",
  "tools": ["Wireshark", "Browser", "..."],
  "prereqs": ["Basic TCP/IP", "..."],
  "objective": "One or two sentences.",
  "deliverables": ["List", "of", "artifacts"],
  "steps": [
    { "title": "Step 1 — Short title", "body": "Full text. Commands, validation, troubleshooting inline. Use \\n for newlines." }
  ],
  "successCriteria": ["Criterion 1", "Criterion 2"]
}
```

**Optional (used when present):**

- **troubleshooting:** `[ { "issue": "...", "fix": "..." } ]`
- **references:** `[ { "title": "...", "url": "..." } ]`
- **cliCheatSheet:** `[ { "command": "...", "syntax": "...", "purpose": "..." } ]`

**Style:**

- **Universal:** Assume Windows or Linux; include exact commands, “Validation” / “What success looks like,” and “Troubleshooting” in step body or in the troubleshooting array.
- **No dependency on the site:** Walkthroughs should work even if someone only has the repo and a browser; they don’t assume “click X in SOC OS.”
- **SOC analyst tone:** Evidence, validation, deliverables, verdict/confidence where relevant.

**Current status:**

- **Walkthrough system:** Complete (UI, step navigation, troubleshooting/references/cliCheatSheet display, JSON structure).
- **Walkthrough content:** Most step bodies are still **high-level checklists**, not yet full rebuildable lab guides. The next task is to **upgrade the step bodies** (exact commands, validation checks, troubleshooting, deliverables, file paths, references) — not to rebuild the system. Do not change IDs or schema; only expand step bodies and optional troubleshooting/references/cliCheatSheet.
- **soc-casefiles:** Only has short checklist-style steps; no full version yet.

---

## 6. Repo-Level Walkthrough (projectsWalkthrough)

- **Location:** `resources.json` → `projectsWalkthrough`.
- **Shape:** `{ "intro": "string", "steps": [ { "title": "...", "body": "..." } ] }`.
- **Purpose:** One walkthrough that explains how to use the repo and the Projects app (pick a track, recreate lab, document, etc.). Shown in the Projects app as a “Walkthrough” tab next to the project grid.

---

## 7. Runbooks

- **Location:** `resources.json` → `runbooks`.
- **Shape:** Array of `{ "id", "title", "category", "steps": [ { "title", "body" } ], optional "githubPath" }`.
- **Purpose:** Short, step-by-step procedures (triage, escalation, tool use). Shown in the Runbooks app: list → click one → see steps. Optional link to full playbook on GitHub.

---

## 8. Tickets (Incident Ticket Simulator)

- **Location:** `resources.json` → `tickets`.
- **Shape:** Array of objects with at least: `id`, `title`, `category`, `difficulty`, `description`, `scenario`, `guidedSteps` (or similar), optional `iocs`, `playbook`, etc.
- **Purpose:** Simulated incidents. Users pick a ticket, choose Guided or Expert mode, and work through the scenario. Alerts app reuses the same ticket data with status (new / assigned / in progress / resolved) in localStorage.

---

## 9. App Intros (appIntros)

- **Location:** `resources.json` → `appIntros`.
- **Shape:** `{ "app-id": "2–4 sentence description of what the app is and how to use it." }`.
- **App ids** (examples): `projects`, `templates`, `tickets`, `cert-path`, `cli-cheats`, `log-viewer`, `case-files`, `playbooks`, `runbooks`, `alerts`, `sec-plus`, `interview-prep`, etc. (same as the desktop icon `id` where applicable.)

---

## 10. Cert Roadmap (certPath)

- **Location:** `resources.json` → `certPath`.
- **Contains:** `current`, `planned`, `completed` (arrays of cert objects), and `certPickerList` (array of `{ name, provider, description, estimatedTime, prerequisite }`) for “Add from list.”
- **Behavior:** User can apply templates, add from list, add custom cert, mark done, remove. State is persisted in localStorage.

---

## 11. Desktop Apps (Window IDs)

These are the main “app” ids used in the VM. Use them when referring to “open X app” or when writing **appIntros** keys.

- start-here, missions, quick-start (Learning Paths), templates, case-files, playbooks, cheat-sheets (Quick Reference), tools (Daily Tools), log-viewer, cli-cheats, glossary, ioc-helper, labs, projects, code-examples, threat-feed, toolbox, skill-drills, games, mini-game, soc-journal, tickets, lab-files, interview-prep, cert-path, sec-plus, report-builder, threat-map, compliance, runbooks, alerts, utilities, terminal, about, settings.

Utilities open sub-apps (e.g. util-hash, util-base64, util-timestamp, util-email, util-ip, util-port, util-useragent, util-evidence, util-timeline).

---

## 12. What You Might Be Asked to Generate (Future / Optional)

*The walkthrough feature and current content are already implemented (see §14). The items below are for when someone asks for **new** or **updated** content later.*

- **Project walkthroughs:** Only if adding a new project or replacing/expanding one (e.g. a full soc-casefiles version). For the current 9, content is already in place. Always use **steps as** `[ { "title", "body" } ]`; include commands, validation, and troubleshooting when doing “full” walkthroughs. Output paste-ready JSON for `projectWalkthroughs.<id>`.
- **Runbook steps:** Short procedure steps (title + body) for runbooks in `resources.json`.
- **App intro copy:** Short “What this app is and how to use it” for `appIntros` (key = app id).
- **Ticket scenarios:** New ticket entries (title, difficulty, scenario, guided steps, etc.) for the Tickets app and Alerts.
- **Cert picker list:** Additional certs for `certPath.certPickerList` (name, provider, description, estimatedTime, prerequisite).
- **CLI command entries:** For `cliCommands`: command, description, examples, optional `syntax` / explanation.
- **Success criteria / deliverables:** For a given lab, bullet lists for `successCriteria` or `deliverables`.

---

## 13. Format Reminders

- **Steps:** Always `[ { "title": "...", "body": "..." } ]`. No plain string steps in projectWalkthroughs.
- **Newlines in JSON strings:** Use `\n` in the body text.
- **IDs:** Use the exact project ids from the table (e.g. `ids-setup` not `ids-setup-lab`). App ids use kebab-case (e.g. `cert-path`, `cli-cheats`).
- **Walkthrough scope:** Only the 9 projects/labs get `projectWalkthroughs`. Do not create walkthroughs for Start Here, Templates, Interview Prep, etc.

---

## 14. What’s Already Done (No Need to Redo)

- **Walkthrough system:** Complete. The Projects app has a repo-level **Walkthrough** tab and, on each project card, a **View walkthrough** button that opens that project's step-by-step guide. Each per-project view shows steps plus optional Troubleshooting, References, and CLI Cheat Sheet sections. Data lives in `resources.json`; the UI is wired up. **Walkthrough content** (step bodies) is mostly high-level checklists and needs to be upgraded into full rebuildable lab guides — see §15.
- **Alerts** app uses tickets + localStorage status; **Runbooks** app has data and list/detail UI.
- **Placeholders** (Report Builder, Threat Map, Compliance) have “What this will do” and “In the meantime” copy.
- **Cert Roadmap** has templates, add-from-list, add-custom-cert form, and empty state.
- **CLI Cheats** have a syntax guide and per-command explanation where data exists.
- **App intros** exist for main apps (projects, tickets, runbooks, cert-path, etc.).

---

## 15. Next Task: Upgrade Walkthrough Bodies

**Goal:** Turn existing step bodies into true rebuildable lab content. Do **not** add new walkthroughs or change IDs/schema.

For every project in `resources.json` → `projectWalkthroughs`:

- Expand each step **body** with: exact CLI commands (copy-paste), validation checks (what output proves success), troubleshooting (common errors + fixes), screenshots/deliverables for that step, file paths (where to save artifacts in the repo), references (official doc links), "If you get stuck" / alternate commands.
- Optionally fill or expand **troubleshooting**, **references**, and **cliCheatSheet** where they exist.
- Output updated JSON blocks ready to paste into `resources.json`.

**Best workflow:** Cursor has repo context (READMEs, folder structure, filenames) and edits the JSON. A content partner (e.g. ChatGPT) can provide "full lab mode" style and structure; one walkthrough (e.g. wireshark) can be rewritten as the template standard for the rest.

Use this breakdown to keep any new content consistent with the repo and the SOC OS data shape.
