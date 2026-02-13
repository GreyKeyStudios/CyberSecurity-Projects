# Threat Intelligence Report Template

Use this template when writing a short threat intel report (IOC summary, campaign note, or actor profile).

## Report Metadata

- **Report ID:** [ID]
- **Title:** [Short descriptive title]
- **Classification:** [Internal/Confidential/etc.]
- **Author:** [Name/Team]
- **Date:** [Date]
- **Last Updated:** [Date]
- **Sources:** [Vendor blogs, OSINT, internal]

---

## Executive Summary

[2–4 sentences: what threat/campaign/actor, key IOCs, intended audience, and recommended action.]

---

## Threat Overview

### Type
- **Category:** [Malware/Phishing/APT/Botnet/Scam/etc.]
- **Target(s):** [Industry, region, technology]
- **Objective:** [e.g. credential theft, ransomware, espionage]

### Context
- **Time frame:** [When observed]
- **Attribution (if any):** [Actor name, low/medium/high confidence]
- **Related campaigns:** [Names or “Unknown”]

---

## Indicators of Compromise (IOCs)

### Domains
| Domain | First Seen | Context |
|--------|------------|---------|
| [Domain] | [Date] | [C2/phishing/etc.] |

### IP Addresses
| IP | First Seen | Context |
|----|------------|---------|
| [IP] | [Date] | [Purpose] |

### URLs
| URL | Context |
|-----|---------|
| [URL] | [Purpose] |

### File Hashes
| Hash (SHA256) | Type | Context |
|---------------|------|---------|
| [Hash] | [File type] | [Dropper/C2/etc.] |

### Email / Other
- **Sender addresses:** [List]
- **Subject patterns:** [Examples]
- **Other (mutexes, YARA):** [As needed]

---

## TTPs (Tactics, Techniques, Procedures)

- **Initial access:** [e.g. Phishing, exploit]
- **Execution:** [e.g. PowerShell, script]
- **Persistence:** [If known]
- **C2:** [Protocols, patterns]
- **MITRE ATT&CK:** [Relevant technique IDs]

---

## Detection Recommendations

- **SIEM/Search:** [Example query or rule logic]
- **EDR/Network:** [What to look for]
- **Blocklist:** [Suggest blocking which IOCs]

---

## Recommendations

- **Immediate:** [Block IOCs, hunt, notify]
- **Short-term:** [Tuning, new detection]
- **Long-term:** [Control or process improvement]

---

## References

- [Source 1 URL]
- [Source 2 URL]
- Internal ticket: [ID]
