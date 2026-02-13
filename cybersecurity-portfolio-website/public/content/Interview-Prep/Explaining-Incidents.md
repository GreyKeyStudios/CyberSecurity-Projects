# How to Explain Security Incidents

A framework for clearly communicating security incidents to different audiences - from technical teams to executive leadership. Master the art of security communication.

---

## Why Communication Matters

As a SOC analyst, you'll need to explain incidents to:
- **Technical teams** (IT, Engineering) - Need implementation details
- **Management** (Directors, VPs) - Need business impact
- **Executives** (C-suite, Board) - Need risk and strategic implications
- **Non-technical staff** - Need awareness and action items
- **External parties** (Customers, Partners) - Need transparency and reassurance

**Poor communication can:**
- Cause delays in response
- Lead to wrong decisions
- Create unnecessary panic
- Damage credibility

**Good communication:**
- Enables fast, informed decisions
- Builds trust and credibility
- Demonstrates professionalism
- Advances your career

---

## The Universal Framework: BLUF + 5W1H

### BLUF - Bottom Line Up Front
*Start with the most important information first.*

**Example:**
> "We detected and contained a ransomware attack on one file server. No data was lost, and the attack did not spread to other systems."

Then follow with the 5W1H details:
- **What** happened?
- **When** did it occur?
- **Where** did it happen?
- **Who** was affected?
- **Why** did it happen?
- **How** did we respond?

---

## Audience-Specific Communication

### 1. Technical Audience (IT, Security Teams, Engineers)

**What they need:**
- Technical details
- Root cause analysis
- IOCs and TTPs
- Remediation steps
- Prevention recommendations

**Example Explanation:**

```
Subject: Incident Report - Ransomware Detection on FileServer01

SUMMARY:
At 14:23 UTC on 2024-02-10, our EDR detected ransomware activity on 
FileServer01 (10.0.5.50). The server was isolated within 8 minutes. 
No data loss occurred.

TECHNICAL DETAILS:
- Malware family: LockBit 3.0
- Initial access: Phishing email with malicious Excel macro
- User: jsmith@company.com
- Process tree: excel.exe → powershell.exe → ransomware.exe
- C2 communications: 185.220.101.45:443 (Tor exit node)
- Files encrypted: 0 (caught before encryption stage)

INDICATORS OF COMPROMISE:
- File hash (SHA256): abc123def456...
- C2 IP: 185.220.101.45
- Malicious domain: evil-c2.onion
- Registry key: HKLM\Software\RandomName

TIMELINE:
14:15 - User opened malicious email attachment
14:22 - Ransomware executable dropped
14:23 - EDR alert triggered
14:25 - System isolated from network
14:31 - IR team engaged
15:00 - Forensic analysis completed
16:00 - System restored from backup

RESPONSE ACTIONS TAKEN:
1. Isolated affected system
2. Collected forensic artifacts (memory dump, disk image, logs)
3. Blocked C2 IP at firewall
4. Reset affected user credentials
5. Scanned all endpoints for IOCs (0 additional detections)
6. Restored system from clean backup

ROOT CAUSE:
User bypassed macro warning and enabled content in malicious Excel file. 
Email bypassed spam filter due to newly registered domain (< 24 hours old).

RECOMMENDATIONS:
1. Block macro execution via GPO for non-developer users
2. Implement email attachment sandboxing
3. Update email filter rules for newly registered domains
4. Additional security awareness training for affected department

ATTACHMENTS:
- Full timeline spreadsheet
- IOC list (CSV)
- Memory dump analysis
- PCAP of C2 communications
```

**Key Points:**
- Use technical terminology
- Include specific IOCs and tool outputs
- Provide actionable next steps
- Attach detailed evidence

---

### 2. Middle Management (Team Leads, Directors, Managers)

**What they need:**
- Business impact
- Resource requirements
- User/customer impact
- Cost implications
- Timeline

**Example Explanation:**

```
Subject: Security Incident Update - Ransomware Contained

Hi [Manager Name],

I wanted to update you on the security incident we handled today.

SITUATION:
We detected and stopped a ransomware attack on one of our file servers 
this afternoon. The good news: we caught it early and prevented any 
data loss or spread to other systems.

BUSINESS IMPACT:
- Affected: 1 server (FileServer01)
- Users impacted: 23 users in the Marketing department
- Downtime: 2 hours while we restored from backup
- Data loss: None
- Cost: Minimal (staff time only, no ransom paid)

WHAT HAPPENED:
An employee opened a malicious email attachment that attempted to 
deploy ransomware. Our security tools detected it and alerted us 
within minutes. We immediately isolated the server and restored 
it from our backups.

NEXT STEPS:
1. Enhanced security training for Marketing department (1 hour session)
2. Implementing additional email protections (no budget impact)
3. Updating our response procedures based on lessons learned

The situation is fully resolved. Normal operations resumed at 4 PM.

Let me know if you need any additional information.

Best regards,
[Your Name]
```

**Key Points:**
- Focus on business impact
- Quantify where possible
- Explain in plain terms
- Emphasize resolution
- Be solution-oriented

---

### 3. Executive Leadership (C-suite, VP, Board)

**What they need:**
- Strategic implications
- Risk to business
- Financial impact
- Reputation/legal concerns
- High-level action plan

**Example Explanation:**

```
Subject: Executive Brief - Security Incident Resolved

INCIDENT SUMMARY:
On February 10, 2024, we successfully detected and contained a 
ransomware attack before it could cause damage to our systems or data.

BUSINESS IMPACT:
✓ No data loss
✓ No customer impact
✓ 2 hours downtime for 23 internal users
✓ No financial loss (no ransom paid)
✓ No regulatory reporting required
✓ No reputation damage

KEY FACTS:
- Attack detected: 14:23
- Threat contained: 14:31 (8 minutes)
- Systems restored: 16:00
- Current status: Resolved

WHY THIS MATTERS:
This incident demonstrates that our security investments are working 
as intended. Our detection and response capabilities prevented what 
could have been a $500K+ incident (based on industry averages for 
ransomware attacks).

ROOT CAUSE:
An employee opened a malicious email attachment. This highlights the 
ongoing need for security awareness training.

ACTIONS TAKEN:
1. Immediate: Isolated threat and restored systems
2. Short-term: Enhanced email filtering and user training
3. Long-term: Evaluating additional preventive controls

LOOKING FORWARD:
We recommend investing in [specific security enhancement] to further 
reduce similar risks. I'm happy to discuss this in detail at your 
convenience.

The situation is fully under control with no ongoing threat.

[Your Name]
[Title]
```

**Key Points:**
- Lead with business outcomes
- Use executive-friendly language
- Avoid technical jargon
- Connect to strategy and budget
- Show value of security investments
- Keep it brief (executives are busy)

---

### 4. Non-Technical Staff (General Employees)

**What they need:**
- Simple explanation
- What they should do
- How it affects them
- Reassurance

**Example Communication:**

```
Subject: Security Update - What You Need to Know

Hi Team,

Earlier today, our security team detected and stopped a security threat 
before it could cause any harm. I want to explain what happened and 
what this means for you.

WHAT HAPPENED:
A harmful email made it through our email filters today. One of our team 
members accidentally opened it, which triggered an alert to our security 
team. They immediately stopped the threat.

THE GOOD NEWS:
✓ No company data was lost or stolen
✓ Your personal information is safe
✓ All systems are secure and working normally
✓ This was caught very early

WHAT YOU SHOULD DO:
1. Be extra cautious with emails, even if they look legitimate
2. Never open attachments unless you're expecting them
3. If something seems suspicious, report it to IT immediately
4. Don't feel bad if you make a mistake - that's why we have security teams

REMINDER - SIGNS OF SUSPICIOUS EMAILS:
⚠️ Unexpected attachments
⚠️ Urgent requests for action
⚠️ Requests for passwords or personal information
⚠️ Strange sender addresses
⚠️ Grammar or spelling mistakes

We'll be scheduling a 30-minute training session next week to help 
everyone recognize these threats. More details coming soon.

Thanks for your attention to security. When in doubt, always ask!

IT Security Team
```

**Key Points:**
- Use simple, non-scary language
- Focus on what they need to know
- Provide clear action items
- Reassure without sugar-coating
- Make security feel approachable

---

### 5. External Stakeholders (Customers, Partners, Public)

**What they need:**
- Transparency
- Impact to them
- What you're doing about it
- Reassurance of security

**Example Communication:**

```
Subject: Security Notification

Dear [Customer/Partner],

We are writing to inform you about a security incident that occurred 
on February 10, 2024, and the steps we've taken to address it.

WHAT HAPPENED:
We detected and responded to a security threat on one of our internal 
systems. Our security team contained the incident quickly and effectively.

IMPACT TO YOU:
After thorough investigation, we have determined that:
- No customer data was accessed or compromised
- No customer-facing systems were affected
- No disruption to services you use

WHAT WE DID:
- Detected the threat within minutes
- Immediately isolated affected systems
- Conducted comprehensive investigation
- Restored systems from secure backups
- Implemented additional protective measures

OUR COMMITMENT:
The security and privacy of your information is our highest priority. 
This incident reinforces our ongoing investment in security technologies 
and practices to protect your data.

If you have any questions or concerns, please contact us at:
[Security Contact Information]

Thank you for your trust in our organization.

Sincerely,
[Name]
[Title]
[Company]
```

**Key Points:**
- Be transparent but measured
- Clearly state impact to them
- Show accountability
- Demonstrate competence
- Provide contact for questions
- Comply with any legal/regulatory requirements

---

## Written vs. Verbal Communication

### Written (Email, Reports, Documentation)

**Best for:**
- Formal incident reports
- Documentation and record-keeping
- Detailed technical analysis
- Providing reference material

**Tips:**
✅ Use clear structure (headings, bullets)
✅ Include executive summary at top
✅ Be precise with facts and timeline
✅ Use professional tone
✅ Proofread before sending

---

### Verbal (Meetings, Calls, Presentations)

**Best for:**
- Real-time updates during active incidents
- Explaining complex situations
- Answering questions and discussion
- Building rapport and trust

**Tips:**
✅ Prepare talking points in advance
✅ Start with BLUF (bottom line up front)
✅ Adjust language to audience
✅ Use analogies for complex concepts
✅ Pause for questions
✅ Follow up with written summary

---

## The "Elevator Pitch" - 30 Second Summary

Be ready to explain any incident in 30 seconds:

**Template:**
> "We detected [WHAT] on [WHEN]. We responded by [ACTION]. The impact was [IMPACT]. The situation is [STATUS]."

**Example:**
> "We detected ransomware on a file server yesterday afternoon. We immediately isolated it and restored from backups. Twenty-three users had two hours of downtime, but no data was lost. The situation is fully resolved and we've implemented additional protections."

---

## Using Analogies for Non-Technical Audiences

Good analogies make technical concepts accessible:

| Technical Concept | Analogy |
|------------------|---------|
| Firewall | Locked door with security guard |
| Encryption | Putting information in a safe with a combination |
| Phishing | Disguising yourself to sneak past reception |
| Ransomware | Burglar locking your files in your own safe |
| Brute force attack | Trying every combination on a lock |
| DDoS attack | Thousands of fake customers blocking the entrance |
| Zero-day exploit | Secret backdoor the builder didn't know about |
| Patch management | Regular maintenance to fix security holes |

---

## Common Mistakes to Avoid

❌ **Using too much jargon with non-technical audiences**
- Bad: "The threat actor used PowerShell obfuscation to bypass EDR heuristics"
- Good: "The attacker used disguised commands to sneak past our security tools"

❌ **Burying the lead**
- Bad: Starting with background, then technical details, then finally the outcome
- Good: Start with outcome, then provide details

❌ **Being too vague**
- Bad: "Some systems were affected"
- Good: "One file server and 23 user accounts were affected"

❌ **Creating panic**
- Bad: "We had a massive breach!"
- Good: "We detected and contained a security incident"

❌ **Making excuses**
- Bad: "It's not our fault, the user clicked the link"
- Good: "An email bypassed our filters; we're enhancing our protections"

❌ **Over-promising**
- Bad: "This will never happen again"
- Good: "We've implemented additional controls to reduce this risk"

---

## Templates for Common Scenarios

### Initial Alert (Active Incident)

```
URGENT: Security Incident in Progress

STATUS: Active investigation
TIME DETECTED: [Time]
SYSTEMS AFFECTED: [List or "Under investigation"]
CURRENT ACTIONS: [What we're doing now]
EXPECTED IMPACT: [What we know so far]
NEXT UPDATE: [Time for next update]
CONTACT: [Who to contact with questions]
```

### Incident Update (Mid-Response)

```
Security Incident Update #[Number]

STATUS: Containment in progress
NEW DEVELOPMENTS: [What's changed]
CURRENT SITUATION: [Summary]
ACTIONS TAKEN: [What we've done]
NEXT STEPS: [What's happening next]
ESTIMATED RESOLUTION: [If known]
```

### Incident Closure

```
Security Incident - RESOLVED

FINAL STATUS: Resolved
SUMMARY: [What happened]
IMPACT: [Final impact assessment]
RESOLUTION: [How it was resolved]
ROOT CAUSE: [Why it happened]
PREVENTION: [Steps taken to prevent recurrence]
LESSONS LEARNED: [Key takeaways]
CONTACT: [For follow-up questions]
```

---

## Practice Exercise

Take this technical finding and rewrite it for three audiences:

**Technical Finding:**
> "At 03:47 UTC, SIEM correlation rule 'Multiple Failed Auths + Success' triggered on account 'admin_backup' with 47 failed authentication attempts (Event ID 4625) from IP 203.0.113.42 followed by successful authentication (Event ID 4624). Geolocation indicates source is Belarus. Account created 2 weeks ago, rarely used. Attacker had access for 12 minutes before detection. No lateral movement detected. Credential stuffing attack using leaked credentials from previous breach."

**Your turn:**
1. Rewrite for: Technical team
2. Rewrite for: Your manager
3. Rewrite for: Executive leadership

---

## Final Tips

✅ **Know your audience** - Adjust technical level accordingly
✅ **Be clear and concise** - Respect people's time
✅ **Focus on facts** - Speculation creates confusion
✅ **Show impact** - Help them understand "so what?"
✅ **Provide actions** - People want to know what's next
✅ **Follow up** - Always close the loop
✅ **Practice** - Communication is a learnable skill

---

*Remember: Your technical skills found the threat. Your communication skills determine how effectively the organization responds to it.*
