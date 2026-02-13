# Phishing Analysis Template

Use this template when analyzing suspicious emails.

## Email Header Analysis

### Basic Information
- **From:** [Display Name] <[Email Address]>
- **To:** [Recipient]
- **Subject:** [Subject Line]
- **Date:** [Date/Time]
- **Message-ID:** [Message ID]

### Header Analysis
```
Received: [Header]
Return-Path: [Path]
Reply-To: [Address]
X-Mailer: [Mailer]
```

### Security Headers
- **SPF:** [Pass/Fail/None]
- **DKIM:** [Pass/Fail/None]
- **DMARC:** [Pass/Fail/None]
- **Alignment:** [Aligned/Not Aligned]

### Red Flags
- [ ] SPF/DKIM/DMARC failures
- [ ] Return-Path mismatch
- [ ] Suspicious Message-ID pattern
- [ ] Unusual X-Mailer
- [ ] Suspicious Received headers

---

## Email Content Analysis

### Subject Line
- **Content:** [Subject]
- **Red Flags:** [Urgency, threats, etc.]

### Body Content
- **Language:** [Language used]
- **Grammar/Spelling:** [Quality assessment]
- **Urgency Indicators:** [List]
- **Requested Actions:** [What they want]

### Links
| URL | Destination | Reputation | Notes |
|-----|-------------|-------------|-------|
| [URL1] | [IP/Domain] | [Result] | [Notes] |
| [URL2] | [IP/Domain] | [Result] | [Notes] |

### Attachments
| File Name | Type | Size | Hash (SHA256) | VirusTotal | Notes |
|-----------|------|------|---------------|------------|-------|
| [File] | [Type] | [Size] | [Hash] | [Result] | [Notes] |

---

## Threat Intelligence

### Domain Analysis
- **Domain:** [Domain]
- **Registration Date:** [Date]
- **Registrar:** [Registrar]
- **DNS Records:** [Findings]
- **Reputation:** [Clean/Suspicious/Malicious]

### IP Analysis
- **IP Address:** [IP]
- **Geolocation:** [Country/City]
- **ISP:** [ISP]
- **AbuseIPDB:** [Result]
- **VirusTotal:** [Result]

### URL Analysis
- **URL:** [URL]
- **VirusTotal:** [Result]
- **URLScan.io:** [Result]
- **Redirect Chain:** [If applicable]

---

## Verdict

### Assessment
- [ ] **Benign** — Legitimate email
- [ ] **Suspicious** — Requires further investigation
- [ ] **Phishing** — Confirmed phishing attempt
- [ ] **Malware** — Contains malicious payload

### Confidence Level
- **High** — Clear indicators present
- **Medium** — Some indicators, needs review
- **Low** — Unclear, requires deeper analysis

### Reasoning
[Explanation of verdict]

---

## IOCs

### Email Indicators
- **From Address:** [Email]
- **Reply-To:** [Email]
- **Subject:** [Subject pattern]

### Network Indicators
- **IP Addresses:** [List]
- **Domains:** [List]
- **URLs:** [List]

### File Indicators
- **File Hashes:** [List]
- **File Names:** [List]

---

## Recommended Actions

### Immediate
- [ ] Quarantine email
- [ ] Block sender domain/IP
- [ ] Notify recipient
- [ ] Add IOCs to blocklist

### Short-term
- [ ] Review email security gateway rules
- [ ] User security awareness training
- [ ] Update phishing playbook if needed

### Long-term
- [ ] Strengthen email security controls
- [ ] Implement DMARC policy
- [ ] Regular phishing simulations

---

## Ticket Notes Format

```
PHISHING ANALYSIS: [Email Subject]
VERDICT: [Verdict]
CONFIDENCE: [Level]

HEADER ANALYSIS:
- SPF: [Result]
- DKIM: [Result]
- DMARC: [Result]

IOCs:
- From: [Email]
- Domain: [Domain]
- IP: [IP]
- URL: [URL]
- Hash: [Hash]

ACTIONS:
- [Action 1]
- [Action 2]
```

---

## References
- [Phishing Casefile Example](../SOC-Casefiles/001-Phishing-Triage/)
- [Threat Intelligence Project](../../Threat-Intelligence/)
