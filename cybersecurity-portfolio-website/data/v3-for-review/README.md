# V3 walkthroughs – verification prompt for ChatGPT

**Option A – single paste**  
Use `../v3-walkthroughs-for-review.json` (all four walkthroughs, ~700 lines). If that’s still over the paste limit, use Option B.

**Option B – paste in parts**  
Send the four JSON files in this folder one at a time (or in two messages), then ask for a combined verification.

**What to ask ChatGPT**

> I’m pasting the four v3 project walkthroughs from my portfolio’s resources.json. Please verify that everything we discussed for this portion was implemented and nothing was missed from copy-paste.
>
> **soc-casefiles:** 12-step “rebuildable” version. Version B merge: title “SOC Casefiles (Incident Documentation Pack)”, extra successCriteria, NIST SP 800-61 in references, nslookup and curl -I in cliCheatSheet, Step 8 body text (Decision/Reason).
>
> **ids-setup:** 15-step IDS Setup (Suricata / Snort) walkthrough.
>
> **malware-analysis:** 14-step Malware Analysis (Triage Lab) walkthrough.
>
> **home-security-lab:** 12-step Home Security Lab walkthrough.
>
> Check: step count, titles, body text, successCriteria, references, cliCheatSheet, deliverables, and that no v3 content we agreed on is missing or truncated.
