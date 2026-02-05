# Phishing Indicators Reference

Quick reference guide for identifying phishing emails and campaigns.

## Email Header Indicators

### SPF/DKIM/DMARC Failures
- **SPF FAIL:** Sender not authorized to send from domain
- **DKIM Missing/Fail:** Email signature invalid or missing
- **DMARC Not Aligned:** Email fails domain alignment check

**Red Flags:**
- SPF: `softfail` or `fail`
- DKIM: Missing or `fail`
- DMARC: `quarantine` or `reject` policy violation

### Header Mismatches
- **Return-Path ≠ From Address:** Sender mismatch
- **Reply-To ≠ From Address:** Reply-to different from sender
- **Message-ID Pattern:** Suspicious or unusual format
- **X-Mailer:** Unusual or missing mailer identification

## Subject Line Indicators

### Urgency Language
- "Urgent action required"
- "Your account will be suspended"
- "Immediate attention needed"
- "Verify your account now"
- "Limited time offer"

### Threatening Language
- "Account will be closed"
- "Legal action required"
- "Payment overdue"
- "Security breach detected"

### Too Good to Be True
- "You've won!"
- "Claim your prize"
- "Free gift"
- "Exclusive offer"

## Sender Indicators

### Display Name Spoofing
- Legitimate company name with suspicious email
- Slight variations: `micr0soft.com` vs `microsoft.com`
- Unicode characters that look like letters

### Suspicious Domains
- Recently registered domains
- Free email services (Gmail, Yahoo) from "business"
- Typosquatting: `amaz0n.com`, `paypa1.com`
- Subdomain abuse: `microsoft-security.com`

## Content Indicators

### Grammar & Spelling
- Poor grammar and spelling errors
- Unprofessional language
- Inconsistent formatting
- Mixed languages

### Generic Greetings
- "Dear Customer"
- "Dear User"
- "Hello"
- No personalization

### Suspicious Links
- Hover reveals different URL than displayed
- Shortened URLs (bit.ly, tinyurl.com)
- IP addresses instead of domains
- HTTP instead of HTTPS
- Suspicious TLDs (.tk, .ml, .ga)

## Attachment Indicators

### Suspicious File Types
- `.exe` - Executable files
- `.scr` - Screen saver (often malware)
- `.zip` - Compressed files (may contain malware)
- `.js` - JavaScript files
- `.vbs` - VBScript files
- `.docm` - Macro-enabled documents

### File Name Red Flags
- "Invoice.pdf.exe" - Double extension
- "Document.scr" - Screen saver masquerading
- Generic names: "document", "file", "readme"
- Urgency in filename: "urgent", "important"

## URL Analysis

### Suspicious URL Patterns
- **IP Address:** `http://192.168.1.1/login`
- **Typosquatting:** `microsft.com`, `gooogle.com`
- **Subdomain Abuse:** `microsoft-security.com`
- **Path Manipulation:** `microsoft.com.evil.com`
- **Shortened URLs:** `bit.ly/xxxxx`, `tinyurl.com/xxxxx`

### URL Red Flags
- HTTP instead of HTTPS
- Suspicious TLDs (.tk, .ml, .ga, .xyz)
- Recently registered domains
- No SSL certificate
- Suspicious redirect chains

## Behavioral Indicators

### Requested Actions
- Click link to verify account
- Download and open attachment
- Enter credentials on website
- Provide personal information
- Send money or gift cards
- Install software

### Social Engineering Tactics
- Authority impersonation (IT, HR, Executive)
- Urgency and time pressure
- Fear tactics (account closure, legal action)
- Curiosity (you have a message, package delivery)
- Reciprocity (free gift, exclusive offer)

## Technical Indicators

### Email Client Warnings
- "This message looks suspicious"
- "Be careful with this message"
- "External sender" warning
- Attachment blocked

### Delivery Anomalies
- Unusual send time (off-hours)
- Bulk email characteristics
- High bounce rate
- Multiple recipients (BCC abuse)

## IOC Types

### Email IOCs
- **From Address:** Sender email
- **Reply-To:** Reply address
- **Subject Line:** Email subject pattern
- **Message-ID:** Unique message identifier

### Network IOCs
- **IP Addresses:** Sender IPs, C2 servers
- **Domains:** Sender domains, malicious URLs
- **URLs:** Phishing links

### File IOCs
- **File Hashes:** MD5, SHA1, SHA256
- **File Names:** Attachment names
- **File Types:** Attachment extensions

## Verification Steps

### 1. Header Analysis
- [ ] Check SPF/DKIM/DMARC
- [ ] Verify Return-Path
- [ ] Review Message-ID
- [ ] Check Received headers

### 2. URL Verification
- [ ] Hover over links (don't click)
- [ ] Check domain registration
- [ ] Verify SSL certificate
- [ ] Check URL reputation

### 3. Attachment Analysis
- [ ] Check file type
- [ ] Verify file hash
- [ ] Submit to VirusTotal
- [ ] **DO NOT OPEN** suspicious files

### 4. Sender Verification
- [ ] Verify sender email domain
- [ ] Check for typosquatting
- [ ] Verify company contact methods
- [ ] Contact sender through known channels

## Common Phishing Types

### Credential Phishing
- Fake login pages
- Account verification requests
- Password reset requests

### Business Email Compromise (BEC)
- Executive impersonation
- Vendor payment fraud
- Invoice scams

### Malware Delivery
- Malicious attachments
- Drive-by downloads
- Malicious links

### Spear Phishing
- Targeted attacks
- Personal information used
- Appears legitimate

## Response Actions

### Immediate
- [ ] Do not click links
- [ ] Do not open attachments
- [ ] Do not reply
- [ ] Report to security team
- [ ] Delete email

### Investigation
- [ ] Extract IOCs
- [ ] Check threat intelligence
- [ ] Analyze headers
- [ ] Document findings

### Containment
- [ ] Block sender domain
- [ ] Block malicious URLs
- [ ] Block IP addresses
- [ ] Update blocklists

---

**Last Updated:** [Date]  
**Version:** 1.0
