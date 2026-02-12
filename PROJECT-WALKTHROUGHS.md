# Project & Lab Walkthroughs — Scope

**Walkthroughs are only for projects and labs.** They are step-by-step guides so you (or anyone visiting the site) can **recreate the project or lab without assistance** — and so planned labs can be done when the time comes.

## What gets a walkthrough (9 total)

| Repo folder              | projects.json id      | Purpose |
|--------------------------|------------------------|--------|
| SOC-Casefiles/           | soc-casefiles          | Case files & playbooks |
| Log-Analysis/            | log-analysis           | Splunk / syslog lab |
| Threat-Intelligence/    | threat-intelligence    | IOC enrichment tool |
| Wireshark-Packet-Capture/| wireshark              | Packet capture lab |
| Firewall-Setup/          | firewall-setup         | Firewall / hardening lab |
| IDS_Setup/               | ids-setup              | IDS lab (planned) |
| Malware-Analysis/        | malware-analysis       | Malware lab (planned) |
| Home-Security-Lab/       | home-security-lab      | Home SIEM lab (planned) |
| Docker-Security-Lab/     | docker-security-lab    | Docker / web app security lab (planned) |

Data lives in **`cybersecurity-portfolio-website/data/resources.json`** under **`projectWalkthroughs`**, keyed by the **projects.json id** (e.g. `soc-casefiles`, `log-analysis`).

## What does *not* get a walkthrough

These are **website/repo content**, not standalone projects or labs:

- **00-Start-Here/** — resume, skills, getting started
- **Code-Examples/** — scripts and examples used by the site
- **Interview-Prep/** — interview content
- **Templates/** — IR/phishing/ticket templates
- **SOC_Notes/** — cheat sheets and notes
- **cybersecurity-portfolio-website/** — the site itself

Do not add `projectWalkthroughs` entries for these. Only the 9 projects/labs above get walkthroughs.
