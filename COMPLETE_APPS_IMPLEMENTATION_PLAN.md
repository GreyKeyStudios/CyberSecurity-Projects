# Complete SOC OS Apps - Full Implementation Plan

## ALL Apps to Add (13 Total + What You Have)

### ✅ Already Exist (Keep & Enhance):
1. **30-Min Practice** ✅
2. **Learning Paths** ✅
3. **Templates** ✅
4. **Daily Tools** ✅
5. **Cheat Sheets** ✅
6. **Practice Labs** ✅
7. **Code Examples** ✅
8. **Interview Prep** ✅
9. **IOC Helper** ✅

### 🆕 NEW Apps to Add (13 from ChatGPT):

---

## 1. 📝 **SOC Journal**
**What:** Daily training log / work journal
**Icon:** NotebookPen or BookText
**Features:**
- Daily entries with date
- "What I studied today"
- "What I practiced"
- "What confused me"
- "Tomorrow's goals"
- Streak counter (days in a row)
- Search entries
- Export to markdown
**Data Storage:** localStorage (client-side)
**Implementation:** Custom React component with form + list view

---

## 2. 🗂️ **Case Files** (Project Walkthroughs)
**What:** Your real SOC investigations
**Icon:** FolderOpen or FileSearch
**Source:** `/SOC-Casefiles/` (5 real cases!)
**Features:**
- List of all casefiles
- Click one → Opens full investigation
- Shows: Timeline, IOCs, Actions Taken, Outcome
- Links to related playbooks
- Screenshots if available
**Data:** Fetch from GitHub markdown files
**Implementation:** Like Templates - fetch and render markdown

---

## 3. 📋 **SOC Playbooks**
**What:** Response procedures for common incidents
**Icon:** ClipboardList or BookCheck
**Source:** `/SOC-Casefiles/_Playbooks/` (5 playbooks!)
**Features:**
- Grid of playbook cards
- Each shows: Incident Type, Severity, Response Time
- Click → Opens full playbook with:
  - Detection signs
  - Immediate actions
  - Investigation steps
  - Containment
  - Remediation
  - Documentation template
**Data:** Fetch from GitHub
**Implementation:** Like Templates

---

## 4. 📡 **Threat Feed** (Daily Intel)
**What:** Curated threat intelligence sources
**Icon:** Radio or Rss
**Features:**
- Categorized link list:
  - **Government:** CISA, FBI IC3
  - **News:** KrebsOnSecurity, BleepingComputer
  - **Research:** The DFIR Report, SANS ISC
  - **Threat Intel:** AlienVault OTX, ThreatPost
  - **Vendor Blogs:** CrowdStrike, Microsoft Security
- Each opens in new tab
- "Updated daily" badge
- Quick descriptions
**Data:** Static list in resources.json
**Implementation:** Simple card grid with external links

---

## 5. 🎓 **Security+ Vault**
**What:** Free Security+ study materials
**Icon:** GraduationCap or Award
**Features:**
- Tabs: Study Plan, Cheat Sheets, Practice, Resources
- **Study Plan:**
  - Week-by-week breakdown
  - Topics to cover
  - Time estimates
- **Cheat Sheets:**
  - Ports & Protocols (use existing!)
  - Acronyms list
  - Security models
  - Cryptography quick ref
- **Practice:**
  - Links to practice questions
  - Professor Messer videos
  - Quizlet flashcards
- **Resources:**
  - Books I used
  - YouTube channels
  - Study tips
**Data:** Mix of GitHub content + curated links
**Implementation:** Tabbed interface with markdown + links

---

## 6. 💻 **CLI Cheatbook**
**What:** Command reference for SOC work
**Icon:** Terminal or Code2
**Features:**
- Searchable command database
- Categories:
  - **Linux:** grep, awk, sed, find, tail, head
  - **Windows:** Event Viewer, netstat, tasklist, wmic
  - **PowerShell:** Get-EventLog, Get-Process, Get-NetConnection
  - **Network:** nmap, netcat, curl, dig, nslookup
  - **Wireshark:** Display filters
  - **Splunk SPL:** Search queries (use existing!)
- Each command has:
  - Description
  - Usage example
  - Common options
  - Copy button
**Data:** JSON with commands
**Implementation:** Searchable list with categories

---

## 7. 🔧 **Toolbox** (Blue Team Tools Installer)
**What:** "New laptop setup" guide
**Icon:** Wrench or Package
**Features:**
- **Essential Tools:**
  - Sysmon (with config)
  - Wireshark
  - Python + pip packages
  - Git
  - VSCode + extensions
- **SOC Tools:**
  - Splunk forwarder
  - Velociraptor
  - Wazuh agent
  - Sysinternals Suite
- **Forensics:**
  - Autopsy
  - FTK Imager
  - Volatility
- Each tool has:
  - Description
  - Install command
  - Config file
  - Download link
  - "Why you need this"
**Data:** Markdown guide
**Implementation:** Categorized list with install commands

---

## 8. 🎫 **Incident Ticket Simulator**
**What:** Fake ServiceNow-style ticket interface
**Icon:** Ticket or FileBox
**Features:**
- **Ticket Queue:**
  - List of fake tickets
  - Priority, Status, Age
  - Click to open
- **Ticket Details:**
  - Incident ID, Time, Reporter
  - Description
  - Affected system
  - Initial logs/IOCs
  - "Your next steps" prompt
  - Links to relevant playbook
  - Evidence section
- **Tickets:**
  - Suspicious login from China
  - Malware detected on workstation
  - Phishing email reported
  - Brute force detected
  - Data exfiltration alert
**Data:** JSON with fake ticket data
**Implementation:** Custom ticket list + detail view

---

## 9. 📊 **Log Viewer** (Training Tool)
**What:** Sample logs with analysis challenges
**Icon:** ScrollText or FileText
**Features:**
- **Log Types:**
  - Windows Security Event Log
  - Apache access.log
  - Syslog
  - Firewall logs
  - DNS query logs
  - Email headers
- **Each log has:**
  - Raw log snippet
  - "What's suspicious?" prompt
  - Highlighted suspicious entries
  - Explanation
  - Relevant SPL query to find it
  - MITRE ATT&CK mapping
- **Challenge mode:**
  - "Find the malicious IP"
  - "Identify the attack technique"
  - Timer + score
**Data:** Markdown with log samples
**Implementation:** Code block display with annotations

---

## 10. 📖 **SOC Glossary**
**What:** Dictionary of SOC/Security terms
**Icon:** BookA or BookOpen
**Features:**
- **Searchable glossary** (live search)
- **Categories:**
  - Tools & Platforms (SIEM, SOAR, EDR, XDR)
  - Threat Intelligence (IOC, TTP, C2, APT)
  - Vulnerabilities (CVE, CWE, CPE, CVSS)
  - Frameworks (MITRE ATT&CK, Kill Chain)
  - Attack Techniques (Lateral Movement, Persistence)
  - Detection (Sigma, YARA)
  - Incident Response (Containment, Remediation)
- **Each term:**
  - Short definition
  - Example usage
  - Related terms
  - Link to official docs
- **Alphabet index** (A-Z quick jump)
**Data:** JSON with terms
**Implementation:** Searchable list with filter

---

## 11. 🗺️ **Cert Path** (Career Roadmap)
**What:** Certification progression tracker
**Icon:** Map or Route
**Features:**
- **Visual timeline/roadmap**
- **Your journey:**
  - ✅ Completed: Security+, Google Cybersecurity, etc.
  - 🔄 In Progress: [Current cert]
  - 📋 Planned: CySA+, AZ-500, CISSP, etc.
- **Each cert card:**
  - Cert name & vendor
  - Status (completed/in-progress/planned)
  - Study resources
  - Time estimate (hours)
  - Cost
  - Prerequisites
  - "Why this cert?"
  - Completion date (if done)
- **Study plan generator**
**Data:** JSON with cert info
**Implementation:** Timeline component with cards

---

## 12. 🎤 **Resume / Interview Toolkit** (Enhanced)
**What:** Expanded interview prep
**Icon:** Users or Briefcase
**Current:** Already exists but enhance it!
**Add:**
- **Mock Interview Simulator:**
  - Random question generator
  - Timed responses
  - Record answers (speech-to-text?)
- **STAR Story Builder:**
  - Template for each project
  - Situation, Task, Action, Result fields
  - Save & practice
- **Project Explainer:**
  - "Explain this to non-technical interviewer"
  - "Explain this to a SOC manager"
  - Practice prompts
- **Behavioral Bank:**
  - Common questions
  - Pre-written answers
- **Technical Trivia:**
  - Random SOC questions
  - Flashcard style
  - Score tracking
**Data:** Mix of existing + new content
**Implementation:** Multi-section component

---

## 13. 🎮 **Mini Game / Easter Egg**
**What:** Fun interactive challenge
**Icon:** Gamepad2 or Dices
**Game Ideas:**
1. **"Find the Malicious IP"**
   - Shows network traffic
   - Click suspicious IPs
   - Timer + score
2. **"Spot the Phishing"**
   - Shows email
   - Multiple choice: Legit or Phish?
   - Explain why
3. **"Port Number Quiz"**
   - Random port number
   - What service?
   - Speed round
4. **"Decode the Payload"**
   - Base64 encoded string
   - Decode it
   - What is it?
5. **"MITRE Bingo"**
   - Bingo card with tactics
   - Match to scenarios
**Implementation:** Simple game logic with React
**Fun factor:** High score, streak counter, leaderboard (localStorage)

---

## Final Desktop Layout (22 Apps Total!)

```
ROW 1: [⚡Practice] [🧭Learning] [📄Templates] [🗂️Cases]      [📋Playbooks]
ROW 2: [🔧Tools]    [📚Cheat]    [🧪Labs]      [💻Code]       [💼Interview]
ROW 3: [🛡️IOC]      [📝Journal]  [📡Intel]     [🎓Sec+]       [💻CLI]
ROW 4: [🔧Toolbox]  [🎫Tickets]  [📊Logs]      [📖Glossary]   [🗺️Roadmap]
ROW 5: [🎮Game]     [More...]
```

---

## Implementation Order

### 🚀 Phase 1: Content Apps (Use Existing)
1. **Case Files** - Link to SOC-Casefiles
2. **Playbooks** - Link to _Playbooks
3. **Sec+ Vault** - Use existing cheat sheets

### 📝 Phase 2: Utility Apps (Easy Build)
4. **SOC Journal** - localStorage journal
5. **Threat Feed** - Static link list
6. **CLI Cheatbook** - Command reference
7. **Toolbox** - Tool setup guide

### 🎯 Phase 3: Interactive Apps
8. **Incident Tickets** - Fake ticket queue
9. **Log Viewer** - Log analysis challenges
10. **SOC Glossary** - Searchable dictionary

### 🌟 Phase 4: Advanced Features
11. **Cert Path** - Visual roadmap
12. **Interview Toolkit** - Enhanced prep
13. **Mini Game** - Easter egg fun

---

## Technical Approach

### For Content Apps (Case Files, Playbooks, Sec+):
```typescript
// Add to resources.json
"caseFiles": [
  {
    "id": "phishing-triage",
    "title": "Phishing Email Triage",
    "date": "2024-01-15",
    "severity": "Medium",
    "githubPath": "SOC-Casefiles/001-Phishing-Triage/README.md"
  }
]

// Fetch and render like Templates
function CaseFilesContent({ caseFiles, currentPath, onNavigate }) {
  // Fetch markdown from GitHub
  // Render with MarkdownContent
}
```

### For Utility Apps (Journal, CLI, Glossary):
```typescript
// Static data or localStorage
const [entries, setEntries] = useState(() => {
  const saved = localStorage.getItem('soc-journal')
  return saved ? JSON.parse(saved) : []
})
```

### For Interactive Apps (Tickets, Game):
```typescript
// Custom game logic
const [score, setScore] = useState(0)
const [tickets] = useState(FAKE_TICKETS)
// Interactive UI with state management
```

---

## Data Files Needed

### New sections in resources.json:
```json
{
  "caseFiles": [...],
  "playbooks": [...],
  "threatFeed": [...],
  "secPlusVault": {...},
  "cliCommands": [...],
  "toolbox": [...],
  "incidentTickets": [...],
  "logSamples": [...],
  "glossary": [...],
  "certPath": [...],
  "miniGames": [...]
}
```

---

## Benefits of Full Implementation

✅ **Desktop feels alive** - 22 apps total!
✅ **Daily utility** - Journal, CLI, Glossary
✅ **Training platform** - Tickets, Logs, Games
✅ **Interview gold** - Case studies, Playbooks, Projects
✅ **Career tool** - Cert roadmap, Interview prep
✅ **Community value** - Sec+ Vault, Threat Feed
✅ **Unique differentiator** - Nothing like this exists!

---

## Next Steps

**Want me to start building these?**

I suggest we do:
1. **Phase 1 first** (3 apps using existing content) - Quick wins!
2. **Then Phase 2** (4 utility apps) - Easy builds!
3. **Then Phase 3** (3 interactive) - Medium difficulty
4. **Finally Phase 4** (3 advanced) - Complex features

**Which phase should I start with?** Or pick specific apps you want first!

This is going to be the most badass SOC portfolio EVER! 🔥
