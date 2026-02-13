# Common SOC Interview Questions

A comprehensive guide to frequently asked questions in SOC analyst interviews, covering technical knowledge, behavioral scenarios, and hands-on problem-solving.

---

## Table of Contents

1. [Technical Questions](#technical-questions)
2. [Behavioral Questions](#behavioral-questions)
3. [Scenario-Based Questions](#scenario-based-questions)
4. [Tool-Specific Questions](#tool-specific-questions)

---

## Technical Questions

### Networking & Protocols

**Q: What is the three-way handshake in TCP?**

A: The three-way handshake establishes a TCP connection:
1. **SYN**: Client sends SYN packet to server
2. **SYN-ACK**: Server responds with SYN-ACK packet
3. **ACK**: Client sends ACK packet to complete connection

**Q: Explain the difference between TCP and UDP.**

A: 
- **TCP**: Connection-oriented, reliable, ordered delivery, error checking, slower (e.g., HTTP, HTTPS, SSH)
- **UDP**: Connectionless, no guaranteed delivery, faster, used for real-time applications (e.g., DNS, VoIP, streaming)

**Q: What ports are commonly used by these services?**

Common ports every SOC analyst should know:
- HTTP: 80
- HTTPS: 443
- SSH: 22
- FTP: 21
- DNS: 53
- SMTP: 25
- RDP: 3389
- SMB: 445

### Security Concepts

**Q: What is the CIA Triad?**

A: The three core principles of information security:
- **Confidentiality**: Information is accessible only to authorized users
- **Integrity**: Information is accurate and unaltered
- **Availability**: Information is accessible when needed

**Q: What is the difference between IDS and IPS?**

A:
- **IDS (Intrusion Detection System)**: Monitors and alerts on suspicious activity (passive)
- **IPS (Intrusion Prevention System)**: Monitors and actively blocks/prevents attacks (active)

**Q: Explain the kill chain model.**

A: The Cyber Kill Chain (Lockheed Martin) describes stages of a cyber attack:
1. Reconnaissance
2. Weaponization
3. Delivery
4. Exploitation
5. Installation
6. Command & Control (C2)
7. Actions on Objectives

### Log Analysis

**Q: What Windows Event IDs indicate a successful logon?**

A: 
- **4624**: Successful account logon
- **4648**: Logon using explicit credentials (RunAs)

**Q: What would you look for when investigating a brute force attack?**

A:
- Multiple failed login attempts (Event ID 4625) from same source
- Short time intervals between attempts
- Attempts across multiple accounts
- Successful login after many failures
- Unusual login times or locations

### Malware & Threat Analysis

**Q: What is the difference between a virus, worm, and Trojan?**

A:
- **Virus**: Requires user action to spread, attaches to files
- **Worm**: Self-replicates without user action, spreads through networks
- **Trojan**: Disguises itself as legitimate software, requires user to execute

**Q: What are common indicators of compromise (IOCs)?**

A:
- Suspicious IP addresses or domains
- File hashes of known malware
- Registry modifications
- Unusual network traffic patterns
- New scheduled tasks or services
- Unusual process names or locations

---

## Behavioral Questions

### Problem-Solving

**Q: Describe a time you identified and resolved a security incident.**

**STAR Framework Answer:**
- **Situation**: During routine monitoring, I detected multiple failed RDP login attempts
- **Task**: Investigate potential brute force attack and prevent account compromise
- **Action**: Analyzed logs, identified source IP, confirmed brute force pattern, blocked IP at firewall, reset affected credentials
- **Result**: Prevented unauthorized access, documented incident, recommended implementing MFA

**Q: How do you stay current with cybersecurity threats?**

A: I actively:
- Follow threat intelligence feeds (CISA, US-CERT)
- Read security blogs (Krebs on Security, Schneier on Security)
- Participate in CTF competitions
- Engage with security communities (Reddit, Discord)
- Review CVE databases and vendor advisories
- Practice in labs (TryHackMe, LetsDefend)

### Teamwork & Communication

**Q: How would you explain a technical security issue to non-technical management?**

A: 
1. Start with business impact (risk to operations, data, reputation)
2. Use analogies (firewall = locked door)
3. Focus on "what" and "why," not technical "how"
4. Provide clear recommendations and action items
5. Quantify risk where possible (potential cost, affected users)

**Q: Describe a time you disagreed with a team member about security priorities.**

**Framework:**
- Acknowledge both perspectives have merit
- Focus on risk-based decision making
- Present evidence and threat intelligence
- Collaborate on solution that addresses both concerns
- Escalate to management if needed for final decision

---

## Scenario-Based Questions

### Phishing Investigation

**Q: A user reports a suspicious email. Walk me through your investigation process.**

**Answer:**
1. **Initial Triage**
   - Don't click links or download attachments
   - Check sender email address for spoofing
   - Review email headers (SPF, DKIM, DMARC)

2. **Email Analysis**
   - Extract URLs and domains
   - Check sender reputation (MXToolbox, Talos)
   - Analyze URLs with URLScan.io or VirusTotal
   - Check for known phishing indicators

3. **Impact Assessment**
   - Did user click link or provide credentials?
   - Check for similar emails to other users
   - Review logs for related activity

4. **Response**
   - Block sender domain/IP if malicious
   - Reset credentials if compromised
   - Alert other users if widespread
   - Document IOCs and findings

### Malware Alert

**Q: An EDR alert shows suspicious PowerShell execution. What do you do?**

**Answer:**
1. **Contain**
   - Isolate affected system from network (if appropriate)
   - Don't power off (preserves volatile memory)

2. **Investigate**
   - Review PowerShell command line arguments
   - Check for encoded/obfuscated commands
   - Identify parent process (what launched PowerShell?)
   - Review file system changes and network connections
   - Check VirusTotal for file hashes

3. **Analyze**
   - Is this expected behavior for this user/system?
   - Are there other affected systems?
   - What is the potential impact?

4. **Respond**
   - Kill malicious processes if confirmed
   - Quarantine malicious files
   - Collect forensic artifacts
   - Restore from known good backup if needed
   - Document timeline and IOCs

### Brute Force Attack

**Q: You notice 1000 failed login attempts to a user account in 5 minutes. What's your response?**

**Answer:**
1. **Immediate Action**
   - Block source IP at firewall
   - Lock affected account temporarily if policy allows

2. **Investigation**
   - Identify all targeted accounts
   - Check if any login succeeded
   - Determine attack source (internal/external, geographic location)
   - Review successful logins after attempts

3. **Remediation**
   - Reset passwords for targeted accounts
   - Enable MFA if not already active
   - Update firewall rules
   - Consider IP reputation blocklists

4. **Prevention**
   - Recommend account lockout policy
   - Implement rate limiting
   - Deploy MFA organization-wide
   - Set up alerts for similar patterns

---

## Tool-Specific Questions

### SIEM (Splunk, QRadar, Sentinel)

**Q: How would you write a Splunk query to find failed login attempts?**

```spl
index=windows EventCode=4625 
| stats count by src_ip, user, _time 
| where count > 5
| sort - count
```

**Q: What is a correlation rule in a SIEM?**

A: A correlation rule connects multiple related events to detect complex attack patterns. Example: Multiple failed logins followed by successful login from same IP = potential brute force success.

### Wireshark

**Q: How do you filter for HTTP traffic in Wireshark?**

A: Filter expressions:
- `http` - All HTTP traffic
- `http.request.method == "POST"` - POST requests only
- `http contains "password"` - HTTP packets containing "password"

### Threat Intelligence Platforms

**Q: What threat intelligence sources do you use?**

A:
- **Open Source**: VirusTotal, AbuseIPDB, AlienVault OTX
- **Government**: CISA alerts, FBI InfraGard
- **Vendor**: Talos Intelligence, Proofpoint
- **Community**: MISP, threat feeds, security blogs

---

## Questions to Ask the Interviewer

Show your interest and evaluate the role:

1. "What does a typical day look like for your SOC analysts?"
2. "What SIEM and security tools does your SOC use?"
3. "How is the SOC structured? (Tiers, shifts, team size)"
4. "What are the most common alerts your SOC handles?"
5. "How do you handle professional development and training?"
6. "What metrics do you use to measure SOC effectiveness?"
7. "Can you describe a recent interesting incident the team handled?"

---

## Tips for Success

✅ **Do:**
- Use the STAR method for behavioral questions
- Be honest about what you don't know
- Ask clarifying questions
- Think out loud during scenario-based questions
- Show enthusiasm for learning

❌ **Don't:**
- Pretend to know something you don't
- Give one-word answers
- Speak negatively about previous employers
- Focus only on tools without understanding concepts
- Forget to ask questions at the end

---

*Remember: Interviewers want to see your thought process and problem-solving approach, not just memorized answers. It's okay to say "I don't know, but here's how I would find out."*
