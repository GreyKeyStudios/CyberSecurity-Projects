# Brute Force Response Playbook

## Purpose
This playbook provides step-by-step procedures for SOC analysts to respond to brute force login attempts and authentication failures.

## Prerequisites
- Access to SIEM/logging systems
- Access to authentication logs (Windows Event Logs, Linux auth.log)
- Access to threat intelligence tools
- Access to firewall/network controls

---

## Triage Steps

### 1. Initial Assessment (5 minutes)
- [ ] Review SIEM alert for failed authentication attempts
- [ ] Identify target account(s)
- [ ] Check attack frequency and pattern
- [ ] Determine source IP address(es)
- [ ] Assess initial severity

**Severity Guidelines:**
- **High:** Admin/privileged account, high frequency, ongoing
- **Medium:** Standard user account, moderate frequency
- **Low:** Single attempt, unclear pattern

### 2. Log Analysis
- [ ] Query authentication logs for failed attempts
- [ ] Identify Event IDs (Windows: 4625, Linux: auth.log failures)
- [ ] Extract source IP addresses
- [ ] Identify target usernames
- [ ] Determine time range of attacks
- [ ] Check for successful logons from same IP

**Key Queries:**
```spl
# Splunk Example
index=windows EventCode=4625
| stats count by src_ip, user, _time
| where count > 10
```

---

## Investigation Steps

### 3. Attack Pattern Analysis
- [ ] Determine attack type:
  - Brute force (same username, multiple passwords)
  - Password spraying (multiple usernames, common passwords)
  - Credential stuffing (known credential pairs)
- [ ] Calculate attack frequency (attempts per minute)
- [ ] Identify attack duration
- [ ] Check for automation indicators

### 4. IP Reputation Check
- [ ] Submit source IP to AbuseIPDB
- [ ] Check VirusTotal for IP reputation
- [ ] Verify geolocation
- [ ] Check for known malicious IPs
- [ ] Review historical abuse reports

### 5. Account Status Check
- [ ] Verify if target account is locked
- [ ] Check account lockout policy
- [ ] Review account for successful logons
- [ ] Check for account compromise indicators
- [ ] Verify account permissions/privileges

### 6. Scope Assessment
- [ ] Check if other accounts are targeted
- [ ] Verify if other systems are affected
- [ ] Review network logs for related activity
- [ ] Check for lateral movement attempts

---

## Containment Steps

### 7. Immediate Actions
- [ ] Block source IP at firewall
- [ ] Enable account lockout (if not already enabled)
- [ ] Lock affected account(s) (if policy allows)
- [ ] Create SIEM alert rule for similar patterns
- [ ] Notify security team

### 8. Network Blocking
- [ ] Add IP to firewall blocklist
- [ ] Update network security controls
- [ ] Block at network perimeter
- [ ] Document blocking actions

---

## Remediation Steps

### 9. Account Security
- [ ] Review account for compromise (check successful logons)
- [ ] Force password reset (if account accessed)
- [ ] Enable MFA (if not already enabled)
- [ ] Review account permissions
- [ ] Document account status

### 10. Policy Review
- [ ] Review account lockout policy
- [ ] Verify lockout thresholds are appropriate
- [ ] Check password policy compliance
- [ ] Review MFA implementation
- [ ] Update policies if needed

### 11. Monitoring Enhancement
- [ ] Create SIEM alert for brute force patterns
- [ ] Set up geolocation-based blocking
- [ ] Implement rate limiting rules
- [ ] Configure automated response (if available)
- [ ] Document monitoring improvements

---

## Escalation Criteria

**Escalate to Security Team Lead if:**
- Privileged account compromised
- Multiple accounts affected
- Successful authentication detected
- Lateral movement suspected
- Advanced attack techniques used

**Escalate to Incident Response if:**
- Confirmed account compromise
- Data access detected
- System compromise suspected
- APT indicators present

---

## Ticket Documentation

### Required Fields:
- **Incident ID:** [ID]
- **Severity:** [Level]
- **Status:** [Open/In Progress/Resolved]
- **Target Account(s):** [List]
- **Source IP(s):** [List]
- **Attack Pattern:** [Type]
- **Actions Taken:** [List]
- **Resolution:** [Summary]

### Template:
```
BRUTE FORCE INCIDENT: [ID]
SEVERITY: [Level]
STATUS: [Status]

SUMMARY:
[One sentence description]

INVESTIGATION:
- Target Account: [Account]
- Source IP: [IP Address]
- Attack Pattern: [Type]
- Frequency: [Attempts/minute]
- Duration: [Time range]
- IP Reputation: [Findings]

IOCs:
- Source IP: [IP Address]
- Target Account: [Account]
- Attack Pattern: [Type]

ACTIONS:
- [Action 1]
- [Action 2]
- [Action 3]

RESOLUTION:
[Brief resolution summary]
```

---

## Prevention Recommendations

### Immediate:
- Enable account lockout policies
- Implement MFA for all accounts
- Review and strengthen password policies

### Short-term:
- Deploy geolocation-based blocking
- Implement rate limiting
- Set up automated alerting

### Long-term:
- Deploy WAF/IPS with brute force protection
- Implement user behavior analytics (UBA)
- Regular security awareness training

---

## References
- [Brute Force Casefile Example](../002-Brute-Force-Login/)
- [Log Analysis Project](../../Log-Analysis/)
- [Threat Intelligence Project](../../Threat-Intelligence/)

---

**Last Updated:** [Date]  
**Version:** 1.0
