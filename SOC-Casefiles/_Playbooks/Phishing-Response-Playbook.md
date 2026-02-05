# Phishing Response Playbook

## Purpose
This playbook provides step-by-step procedures for SOC analysts to respond to phishing email reports and investigations.

## Prerequisites
- Access to email security gateway
- Access to threat intelligence tools (VirusTotal, AbuseIPDB)
- Access to SIEM/logging systems
- Email header analysis tools

---

## Triage Steps

### 1. Initial Assessment (5 minutes)
- [ ] Review email security gateway alert
- [ ] Check email headers (SPF, DKIM, DMARC)
- [ ] Identify sender, recipient, subject line
- [ ] Check for attachments or suspicious links
- [ ] Determine initial severity (Low/Medium/High)

**Severity Guidelines:**
- **High:** Executed attachment, confirmed malicious, multiple recipients
- **Medium:** Suspicious indicators, single recipient
- **Low:** Unclear, requires investigation

### 2. Email Header Analysis
- [ ] Extract full email headers
- [ ] Check SPF record alignment
- [ ] Verify DKIM signature
- [ ] Review DMARC policy
- [ ] Analyze Return-Path vs. From address
- [ ] Check Message-ID pattern
- [ ] Review Received headers for IP addresses

**Red Flags:**
- SPF/DKIM/DMARC failures
- Return-Path mismatch
- Suspicious Message-ID
- Unusual X-Mailer headers

---

## Investigation Steps

### 3. URL Analysis
- [ ] Extract all URLs from email body
- [ ] Check URL reputation (VirusTotal, URLScan.io)
- [ ] Analyze redirect chains
- [ ] Check domain registration date
- [ ] Verify DNS records
- [ ] Document all findings

### 4. Attachment Analysis (if present)
- [ ] Extract file hash (MD5, SHA1, SHA256)
- [ ] Submit to VirusTotal
- [ ] Check file type and size
- [ ] Analyze file metadata
- [ ] **DO NOT EXECUTE** - Use sandbox if needed

### 5. IP Address Analysis
- [ ] Extract IP addresses from headers
- [ ] Check IP reputation (AbuseIPDB, VirusTotal)
- [ ] Verify geolocation
- [ ] Check for known malicious IPs
- [ ] Document findings

### 6. Domain Analysis
- [ ] Check domain age and registration
- [ ] Review DNS records (A, MX, SPF)
- [ ] Check domain reputation
- [ ] Verify domain similarity to legitimate domains

---

## Containment Steps

### 7. Immediate Actions
- [ ] Quarantine email (if not already done)
- [ ] Block sender domain at email gateway
- [ ] Block malicious IPs at firewall
- [ ] Add IOCs to threat intelligence feeds
- [ ] Notify affected users (if email was delivered)

### 8. User Notification
- [ ] Send security awareness notification
- [ ] Provide indicators to watch for
- [ ] Advise on credential changes (if credentials exposed)
- [ ] Document user response

---

## Remediation Steps

### 9. IOC Documentation
- [ ] Document all IOCs:
  - Email addresses
  - IP addresses
  - Domains/URLs
  - File hashes
  - Subject line patterns

### 10. Blocklist Updates
- [ ] Add IOCs to email security blocklist
- [ ] Update firewall rules
- [ ] Update threat intelligence feeds
- [ ] Share IOCs with security team

### 11. Follow-up Actions
- [ ] Review email security gateway rules
- [ ] Check for similar emails in environment
- [ ] Update phishing playbook if needed
- [ ] Schedule user security awareness training

---

## Escalation Criteria

**Escalate to Security Team Lead if:**
- Multiple users affected
- Confirmed data breach
- Advanced persistent threat (APT) indicators
- Executive-level targets
- Financial/phishing campaign

**Escalate to Incident Response if:**
- Malware executed
- Credentials confirmed stolen
- Lateral movement detected
- Data exfiltration suspected

---

## Ticket Documentation

### Required Fields:
- **Incident ID:** [ID]
- **Severity:** [Level]
- **Status:** [Open/In Progress/Resolved]
- **IOCs:** [List all indicators]
- **Actions Taken:** [List all actions]
- **Resolution:** [Brief summary]

### Template:
```
PHISHING INCIDENT: [ID]
SEVERITY: [Level]
STATUS: [Status]

SUMMARY:
[One sentence description]

INVESTIGATION:
- Header Analysis: [SPF/DKIM/DMARC results]
- URL Analysis: [Findings]
- Attachment Analysis: [If applicable]
- IP Analysis: [Findings]

IOCs:
- Email: [Address]
- Domain: [Domain]
- IP: [IP Address]
- URL: [URL]
- Hash: [If applicable]

ACTIONS:
- [Action 1]
- [Action 2]
- [Action 3]

RESOLUTION:
[Brief resolution summary]
```

---

## References
- [Phishing Casefile Example](../001-Phishing-Triage/)
- [Phishing Analysis Template](../../Templates/Phishing-Analysis-Template.md)
- [Threat Intelligence Project](../../Threat-Intelligence/)

---

**Last Updated:** [Date]  
**Version:** 1.0
