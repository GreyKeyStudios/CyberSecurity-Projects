# My SOC Operating System

A curated portfolio and learning environment that organizes my Splunk queries, incident response templates, IOC investigation workflows, code examples, and interview prep resources. 

Developed using AI-assisted workflows and refined through hands-on testing and continuous iteration.

---

## 🚀 Quick Access

### When Investigating
- **Found an IOC?** → [IOC Helper Tool](cybersecurity-portfolio-website/app/resources/ioc-helper/)
- **Need a template?** → [Templates/](Templates/)
- **What's this Event ID?** → [SOC-Notes/Windows-Event-IDs.md](SOC-Notes/Windows-Event-IDs.md)
- **Need a Splunk query?** → [Code-Examples/splunk-queries.md](Code-Examples/splunk-queries.md)
- **Extract IOCs from text?** → Run `python Code-Examples/regex-extractors.py`

### When Practicing
- **Daily checklist** → [Daily-Practice-Checklist.md](Daily-Practice-Checklist.md)
- **30-min practice ideas** → [Website Resources](cybersecurity-portfolio-website/app/resources/)
- **Interview prep** → [Interview-Prep/](Interview-Prep/)
- **Code to run** → [Code-Examples/](Code-Examples/)
- **Playbooks** → [SOC-Casefiles/_Playbooks/](SOC-Casefiles/_Playbooks/)

### When Learning
- **Casefiles to review** → [SOC-Casefiles/](SOC-Casefiles/)
- **Cheat sheets** → [SOC-Notes/](SOC-Notes/)
- **Lab walkthroughs** → [Individual project folders](.)

---

## 📂 Folder Structure

```
/
├── Templates/                   ← Copy these when documenting incidents
├── SOC-Notes/                   ← Quick reference cheat sheets
├── SOC-Casefiles/               ← Real investigation examples
├── Code-Examples/               ← Scripts to automate boring stuff
├── Interview-Prep/              ← Questions + STAR stories
├── Daily-Practice-Checklist.md  ← What to do each day
└── cybersecurity-portfolio-website/
    └── app/resources/           ← Full resource hub with links
```

---

## ⚡ Today's Quick Win

**If you only have 30 minutes:**

Pick ONE:
- 🔍 Check 3 random IPs with IOC Helper
- 📝 Review 5 MITRE ATT&CK techniques  
- 💻 Practice 3 Splunk queries from memory
- 📧 Analyze one phishing email from spam folder
- 🏋️ Do one TryHackMe room section
- 📋 Write a mini casefile from a recent lab
- 🐍 Test one Python script with real data
- 🎤 Record yourself answering one interview question

**Seriously, pick one and do it now.**

---

## 🛠️ How I Use This

### Daily Routine
1. Check [Daily-Practice-Checklist.md](Daily-Practice-Checklist.md)
2. Pick one 30-minute practice task
3. Document what I learned
4. Update relevant notes/templates

### During Labs
1. Follow relevant playbook from `SOC-Casefiles/_Playbooks/`
2. Use templates from `Templates/`
3. Reference cheat sheets from `SOC-Notes/`
4. Write casefile when done

### When Job Hunting
1. Review `Interview-Prep/` daily
2. Practice STAR stories out loud
3. Add new projects to casefiles
4. Update resume with new skills

### When Stuck
1. Check if there's a cheat sheet for it
2. Look at similar casefiles
3. Run relevant Python script
4. Search my own notes first, then Google

---

## 📊 Current Status

### This Week
- [ ] Practiced ___ minutes
- [ ] Completed ___ TryHackMe rooms
- [ ] Wrote ___ casefiles
- [ ] Analyzed ___ samples/emails
- [ ] Updated ___ resources

### Learning Focus This Month
- [ ] Main skill: ________________
- [ ] Target: ___________________
- [ ] Progress: ____/10

---

## 🎯 What Makes This Different

**Not a portfolio.** It's my personal SOC wiki.

**Not for show.** It's for actual daily use.

**Not perfect.** It's real and constantly updated.

I update this as I learn. Some things are incomplete. Some are rough. That's fine — it's a working document, not a finished product.

---

## 🔧 Setup

### Website (Local Dev)
```bash
cd cybersecurity-portfolio-website
npm install
npm run dev
# Visit http://localhost:3000/resources
```

### Python Scripts
```bash
# Install dependencies for IOC enrichment
pip install requests python-dotenv

# Run examples
python Code-Examples/log-parser-examples.py
python Code-Examples/regex-extractors.py
```

### API Keys (Optional)
Create `.env` file in `Code-Examples/` for IOC enrichment:
```
VIRUSTOTAL_API_KEY=your_key
ABUSEIPDB_API_KEY=your_key
OTX_API_KEY=your_key
```

---

## 📚 What's Inside

### Templates (3)
- Incident Report Template
- Ticket Notes Template  
- Phishing Analysis Template

### SOC Notes (4)
- Common Ports Cheat Sheet
- Windows Event IDs Reference
- SIEM Query Notes
- Phishing Indicators Guide

### Casefiles (5 + Playbooks)
- Phishing Triage
- Brute Force Login
- Malware EDR Alert
- Impossible Travel
- Splunk Failed Login Triage

### Code Examples (4)
- IOC Enrichment (Python)
- Log Parsers (Python)
- Splunk Queries (40+)
- Regex IOC Extractors (Python)

### Interview Prep (3)
- 100+ Interview Questions
- STAR Method Guide
- Communication Templates

### Tools & Resources (37 total)
- Quick Start paths
- Threat intel tools
- Blue team labs
- Learning resources

---

## 🚦 Priority Items

### Use Daily
- [x] IOC Helper Tool
- [x] Windows Event IDs cheat sheet
- [x] Splunk query library
- [x] Daily practice checklist

### Use When Needed
- [x] Incident templates
- [x] Phishing analysis template
- [x] Interview prep guides
- [x] Code automation scripts

### Reference Material
- [x] Casefiles for examples
- [x] Playbooks for workflows
- [x] Tool lists
- [x] Learning paths

---

## 💡 Tips for Making This Yours

1. **Customize everything** - Change what doesn't work for you
2. **Add as you go** - New tool? Add it. New technique? Document it.
3. **Delete old stuff** - Remove what you never use
4. **Keep it simple** - Don't overcomplicate
5. **Use it daily** - If you're not using it, it's not useful

---

## 📝 Recent Updates

Track what you add/change:

- `[Date]` - Added 30-min practice section
- `[Date]` - Created daily checklist
- `[Date]` - Updated IOC helper with new sources
- `[Date]` - Added interview STAR story

---

## 🎓 Learning Philosophy

**Practice > Theory**
Read less. Do more.

**Document Everything**
Future you will thank present you.

**Small Daily Wins**
15 minutes > 0 minutes.

**Real Over Perfect**
Working code > perfect code.

**Use What You Build**
If you're not using it, why did you build it?

---

## 🚀 Next Actions

What are you working on next?

- [ ] ______________________
- [ ] ______________________
- [ ] ______________________

---

## ⭐ This is Living Documentation

Nothing here is "finished."

It's constantly evolving as I learn new things.

That's the point.

---

**Last updated:** [Add date when you make changes]

**Current focus:** [What you're learning right now]

**Next goal:** [What you want to learn next]

---

*This is my SOC OS. If you found it, feel free to fork it and make it yours.*
