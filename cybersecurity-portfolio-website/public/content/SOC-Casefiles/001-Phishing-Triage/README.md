# Casefile 001: Phishing Email Triage

## Alert Summary
**Alert Type:** Suspicious Email  
**Severity:** Medium  
**Source:** Email Security Gateway  
**Date:** [Date]  
**Status:** Resolved

---

## Initial Triage

### Alert Details
- **Subject:** "Urgent: Verify Your Account"
- **From:** `noreply@legitimate-looking-domain.com`
- **Recipient:** user@company.com
- **Time Received:** [Timestamp]
- **Attachment:** `invoice.pdf` (detected by email security)

### Initial Assessment
- Email security gateway flagged attachment as suspicious
- Sender domain appears legitimate but requires verification
- Subject line contains urgency language (red flag)

**Priority:** Medium — Requires investigation before user action

---

## Investigation

### 1. Email Header Analysis
**Tools Used:** Email client, header analyzer

**Key Findings:**
```
Received: from [suspicious-ip] ([IP Address])
Return-Path: <different-from-display@actual-domain.com>
Message-ID: [suspicious pattern]
X-Mailer: [unusual mailer]
```

**Indicators:**
- SPF check: **FAIL**
- DKIM: **Missing**
- DMARC: **Not aligned**
- Return-Path mismatch with display name

### 2. URL/IP Reputation Check
**Tools Used:** Threat Intelligence APIs (VirusTotal, AbuseIPDB)

**URLs Found:**
- `http://suspicious-link.com/verify`
- `http://[IP]/login`

**Results:**
| Indicator | Source | Verdict | Details |
|-----------|--------|---------|---------|
| suspicious-link.com | VirusTotal | Malicious | 45/70 engines flagged |
| [IP Address] | AbuseIPDB | Suspicious | 12 abuse reports, Country: [X] |

### 3. Attachment Analysis
**File:** `invoice.pdf`  
**Hash:** `[SHA256]`

**VirusTotal Results:**
- Detection: 8/70 engines flagged
- File type: PDF (potentially weaponized)
- **Recommendation:** Do not open

### 4. Domain Analysis
**Sender Domain:** `legitimate-looking-domain.com`

**Findings:**
- Domain registered: [Recent date]
- DNS records: Suspicious SPF configuration
- Historical reputation: No prior legitimate use

---

## Findings

### Verdict: **PHISHING ATTEMPT**

### Indicators of Compromise (IOCs)
- **Email:** `noreply@legitimate-looking-domain.com`
- **URLs:** 
  - `http://suspicious-link.com/verify`
  - `http://[IP]/login`
- **IP Address:** `[IP]`
- **File Hash:** `[SHA256]`
- **Domain:** `legitimate-looking-domain.com`

### Attack Vector
1. Email with urgent subject line
2. Legitimate-looking sender display name
3. Suspicious attachment (PDF)
4. Malicious links in email body

### Impact Assessment
- **Users Affected:** 1 (recipient)
- **Data at Risk:** Credentials, financial information
- **Potential Damage:** Account compromise, credential theft

---

## Resolution

### Actions Taken
1. ✅ Quarantined email (prevented delivery)
2. ✅ Blocked sender domain and IP
3. ✅ Added IOCs to threat intelligence feeds
4. ✅ Notified user (if email was delivered)
5. ✅ Created firewall rule to block malicious IPs

### Recommendations
- **Immediate:** User education on phishing indicators
- **Short-term:** Review email security gateway rules
- **Long-term:** Implement DMARC policy enforcement

### Containment
- Email blocked at gateway
- No user interaction occurred
- IOCs added to blocklist

---

## Ticket Notes

```
INCIDENT: 001-Phishing-Triage
STATUS: Resolved
SEVERITY: Medium

SUMMARY:
Phishing email detected by email security gateway. Email contained 
suspicious attachment and malicious links. SPF/DKIM/DMARC checks failed.

INVESTIGATION:
- Header analysis: SPF FAIL, DKIM missing
- URL reputation: 45/70 engines flagged as malicious
- Attachment: 8/70 engines flagged PDF
- Domain: Recently registered, suspicious

IOCs:
- Email: noreply@legitimate-looking-domain.com
- URLs: suspicious-link.com/verify, [IP]/login
- IP: [IP Address]
- Hash: [SHA256]

ACTIONS:
- Quarantined email
- Blocked sender domain/IP
- Added IOCs to threat intel
- User notification sent

RESOLUTION:
No user interaction. Email blocked at gateway. IOCs blocked.
```

---

## Lessons Learned
- Always verify email headers, not just display names
- SPF/DKIM/DMARC failures are strong indicators
- Threat intelligence enrichment is critical for URL/IP analysis
- User education is essential for phishing prevention

---

## References
- [Phishing Analysis Template](../Templates/Phishing-Analysis-Template.md)
- [Threat Intelligence Project](../../Threat-Intelligence/)
