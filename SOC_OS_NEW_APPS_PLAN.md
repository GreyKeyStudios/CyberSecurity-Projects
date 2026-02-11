# SOC OS Desktop - New Apps Plan

## Current State
You have a SICK foundation but the desktop feels empty. You have tons of content already created that needs to be surfaced as apps!

## Existing Content to Turn Into Apps

### 1. 🗂️ **Case Files** (PERFECT!)
**Source:** `/SOC-Casefiles/` (5 real investigations!)
- 001-Phishing-Triage
- 002-Brute-Force-Login
- 003-Malware-EDR-Alert
- 004-Impossible-Travel
- 005-Splunk-Failed-Login-Triage

**App Name:** "Case Files" or "Investigations"
**Icon:** FolderOpen or FileSearch
**What it does:** 
- Lists your 5 real case studies
- Click one → Opens the casefile with full investigation details
- Shows playbooks from `_Playbooks/` folder

### 2. 🧪 **Labs & Projects** (YOU HAVE THIS!)
**Source:** Multiple project folders
- Docker-Security-Lab/
- Firewall-Setup/
- Home-Security-Lab/
- IDS_Setup/
- Wireshark-Packet-Capture/
- Log-Analysis/
- Malware-Analysis/

**App Name:** "Projects" or "Lab Walkthroughs"
**Icon:** Beaker or Microscope
**What it does:**
- Grid of project cards
- Each has: Title, Description, Tech Stack, Link to README
- Screenshots if available
- "What I learned" section

### 3. 📚 **Playbooks** (ALREADY EXISTS!)
**Source:** `/SOC-Casefiles/_Playbooks/`
- Brute-Force-Response.md
- Impossible-Travel-Response.md
- Malware-Alert-Response.md
- Phishing-Email-Response.md
- Ransomware-Response.md

**App Name:** "Playbooks" or "Response Guides"
**Icon:** BookCheck or ClipboardList
**What it does:**
- List of all playbooks
- Click one → Opens full playbook with:
  - Detection signs
  - Immediate actions
  - Investigation steps
  - Remediation
  - Documentation template

### 4. 📝 **SOC Journal** (NEW - Use existing checklist)
**Source:** `Daily-Practice-Checklist.md` as template
**App Name:** "Journal" or "Training Log"
**Icon:** NotebookPen or Calendar
**What it does:**
- Daily log entries (stored in localStorage)
- "What I studied today"
- "What I practiced"
- "What confused me"
- "Tomorrow's goals"
- Streak counter
- Calendar view of entries

### 5. 📡 **Threat Feed** (NEW - Curated links)
**App Name:** "Intel Feed" or "Threat Intel"
**Icon:** Radio or Rss
**What it does:**
- Curated list of threat intel sources:
  - CISA Alerts
  - KrebsOnSecurity
  - The DFIR Report
  - BleepingComputer
  - SANS ISC
  - AlienVault OTX
  - CrowdStrike Blog
- Each link opens in new tab
- Could add "Latest" section with RSS feed (advanced)

### 6. 🎓 **Security+ Vault** (NEW - Study materials)
**App Name:** "Sec+ Vault" or "Cert Prep"
**Icon:** GraduationCap or Award
**What it does:**
- Sec+ cheat sheets
- Port/protocol tables (from Common-Ports-CheatSheet.md!)
- Acronym list
- "Things that show up on exam"
- Practice question links
- Study plan
- "How I passed" notes

### 7. 💻 **CLI Cheatbook** (NEW but easy)
**App Name:** "CLI Cheats" or "Commands"
**Icon:** Terminal or Code
**What it does:**
- Sections:
  - Linux (grep, awk, sed, find, tail)
  - Windows (Event Viewer, netstat, tasklist)
  - PowerShell (Get-EventLog, Get-Process)
  - Network (nmap, netcat, curl)
  - Wireshark filters
  - Splunk SPL (already have in Code-Examples!)
- Searchable
- Copy button for each command

### 8. 🔧 **Toolbox** (NEW - Tool installer guide)
**App Name:** "Toolbox" or "Setup Guide"
**Icon:** Wrench or Package
**What it does:**
- "New SOC analyst laptop setup"
- Tools to install:
  - Sysmon + config
  - Wireshark
  - Splunk forwarder
  - Python + libraries
  - VSCode + extensions
  - Git
  - VirtualBox/VMware
- Install commands for each
- Config files
- "Why you need this"

### 9. 📊 **Log Viewer** (NEW - Training tool)
**App Name:** "Log Analyzer" or "Log Samples"
**Icon:** ScrollText or FileText
**What it does:**
- Sample logs with annotations:
  - Windows Security Event Log
  - Apache access.log
  - Syslog
  - Firewall logs
  - DNS logs
- Highlights suspicious entries
- "What's wrong here?" challenges
- Shows relevant SPL queries

### 10. 📖 **SOC Dictionary** (NEW but valuable)
**App Name:** "Dictionary" or "Glossary"
**Icon:** BookOpen or BookA
**What it does:**
- Searchable glossary:
  - SIEM, SOAR, EDR, XDR
  - IOC, TTP, C2
  - CVE, CWE, CPE
  - MITRE ATT&CK
  - Lateral movement
  - Persistence, Privilege escalation
  - Living off the land
- Short, clear definitions
- Links to resources
- Grouped by category

### 11. 🗺️ **Cert Roadmap** (NEW - Career path)
**App Name:** "Roadmap" or "Career Path"
**Icon:** Map or Route
**What it does:**
- Your cert journey:
  - ✅ Completed: Security+
  - 🔄 In Progress: [Current]
  - 📋 Planned: CySA+, AZ-500, etc.
- Each cert has:
  - Study resources
  - Time estimate
  - Cost
  - "Why this cert?"
- Visual roadmap/timeline

### 12. 🎯 **Interview Mode** (NEW - Interview prep+)
**App Name:** "Interview Prep" (already exists but enhance!)
**Icon:** Briefcase or Users
**Enhance existing with:**
- Mock interview simulator
- Timed Q&A practice
- STAR story builder
- "Explain this project" drills
- Behavioral question bank
- Technical trivia
- Confidence boosters

## Implementation Priority

### Phase 1: Quick Wins (Use Existing Content)
1. **Case Files** - Connect to existing SOC-Casefiles
2. **Playbooks** - Connect to existing _Playbooks
3. **Projects** - Connect to existing project folders
4. **Sec+ Vault** - Use existing cheat sheets

### Phase 2: New Utility Apps
5. **SOC Journal** - Simple localStorage app
6. **Threat Feed** - Curated link list
7. **CLI Cheatbook** - Reference content
8. **Toolbox** - Setup guide content

### Phase 3: Advanced Features
9. **Log Viewer** - Interactive training
10. **SOC Dictionary** - Searchable glossary
11. **Cert Roadmap** - Visual timeline
12. **Interview Mode** - Enhanced prep

## Desktop Icon Grid Layout

Current (9 apps):
```
[⚡30-Min] [🧭Learning] [📄Templates]
[🔧Tools]  [📚Cheat]    [🧪Labs]
[💻Code]   [💼Interview] [🛡️IOC]
```

After Phase 1 (13 apps):
```
[⚡Practice] [🧭Learning] [📄Templates] [🗂️Cases]
[🔧Tools]    [📚Cheat]    [🧪Labs]      [📋Playbooks]
[💻Code]     [💼Interview] [🛡️IOC]      [🎓Sec+]
[📝Journal]
```

After All Phases (17 apps):
```
[⚡Practice] [🧭Learning] [📄Templates] [🗂️Cases]
[🔧Tools]    [📚Cheat]    [🧪Labs]      [📋Playbooks]
[💻Code]     [💼Interview] [🛡️IOC]      [🎓Sec+]
[📝Journal]  [📡Intel]     [💻CLI]       [🔧Toolbox]
[📊Logs]     [📖Dict]      [🗺️Roadmap]
```

## Data Structure Additions

### New resources.json sections needed:

```json
{
  "caseFiles": [...],      // Link to SOC-Casefiles
  "playbooks": [...],      // Link to _Playbooks
  "projects": [...],       // Link to project folders
  "threatIntel": [...],    // Curated links
  "cliCommands": [...],    // Command reference
  "toolbox": [...],        // Tool setup guide
  "glossary": [...],       // Dictionary terms
  "certRoadmap": [...]     // Cert progression
}
```

## Technical Implementation

### Pattern for Content Apps:
1. Add to `desktopIcons` array
2. Add to `resources.json` with githubPath
3. Create content component (like TemplatesContent)
4. Use existing navigation stack system
5. Fetch markdown from GitHub
6. Render with MarkdownContent

### Pattern for Utility Apps:
1. Add to `desktopIcons` array
2. Create dedicated component
3. Use localStorage for persistent data (Journal)
4. Use static content (Threat Feed, CLI Cheats)
5. No GitHub fetch needed

## Next Steps

1. **Choose 3-4 apps to add first** (recommend: Case Files, Playbooks, Projects, Journal)
2. **Update resources.json** with new sections
3. **Create content components** for each
4. **Add icons** to desktop grid
5. **Test navigation** and content display

## Benefits

✅ Makes desktop feel full and alive
✅ Surfaces your existing content
✅ Shows depth of your work
✅ Practical daily-use tools
✅ Interview gold mine
✅ Demonstrates real SOC thinking
✅ Unique portfolio differentiator

This is going to be INSANE when it's done!
