# Impossible Travel Response Playbook

## Purpose
This playbook provides step-by-step procedures for SOC analysts to respond to impossible travel alerts, which indicate potential account compromise when a user authenticates from geographically distant locations in an impossible time frame.

## Prerequisites
- Access to identity provider logs
- Access to SIEM/logging systems
- Access to geolocation tools
- Access to user account management
- Access to device management

---

## Triage Steps

### 1. Initial Assessment (5 minutes)
- [ ] Review identity provider alert
- [ ] Identify user account
- [ ] Verify location 1 and location 2
- [ ] Calculate distance and time difference
- [ ] Determine if travel is physically impossible
- [ ] Assess initial severity

**Severity Guidelines:**
- **High:** Privileged account, confirmed impossible travel, active session
- **Medium:** Standard account, suspicious pattern
- **Low:** Unclear, requires investigation

### 2. Authentication Log Analysis
- [ ] Query authentication logs for user account
- [ ] Extract IP addresses for both locations
- [ ] Verify authentication timestamps
- [ ] Check authentication methods (password, MFA)
- [ ] Identify device/user agent for each location
- [ ] Check for concurrent sessions

**Key Queries:**
```spl
# Splunk Example
index=auth user=username@company.com
| stats values(location) as locations, values(ip) as ips by _time
| where locations > 1
```

---

## Investigation Steps

### 3. Geolocation Analysis
- [ ] Verify IP geolocation accuracy
- [ ] Check if IPs are from VPN services
- [ ] Verify if IPs are from known corporate networks
- [ ] Calculate physical travel time required
- [ ] Determine if travel is possible

### 4. IP Reputation Check
- [ ] Submit IPs to AbuseIPDB
- [ ] Check VirusTotal for IP reputation
- [ ] Verify if IPs are known VPN/proxy services
- [ ] Check for historical abuse reports
- [ ] Review IP ownership/ISP

### 5. Device Analysis
- [ ] Compare device fingerprints
- [ ] Check user agent strings
- [ ] Verify device trust status
- [ ] Review device registration history
- [ ] Check for known vs. unknown devices

### 6. User Account Review
- [ ] Verify user's travel status
- [ ] Check user's known locations
- [ ] Review account for compromise indicators
- [ ] Check for successful authentication from suspicious location
- [ ] Verify account permissions/privileges

### 7. Session Analysis
- [ ] Check if both sessions are active
- [ ] Review session duration
- [ ] Check for concurrent access
- [ ] Review session activity
- [ ] Verify if data was accessed

---

## Containment Steps

### 8. Immediate Actions
- [ ] Terminate suspicious session(s)
- [ ] Lock user account (if policy allows)
- [ ] Force password reset
- [ ] Require MFA re-registration
- [ ] Block suspicious IP at firewall
- [ ] Notify security team

### 9. Account Security
- [ ] Review all active sessions
- [ ] Terminate all sessions (if needed)
- [ ] Force password reset
- [ ] Require MFA re-registration
- [ ] Review account activity logs
- [ ] Check for data access

---

## Remediation Steps

### 10. User Verification
- [ ] Contact user to verify legitimate access
- [ ] Document user response
- [ ] Verify user's actual location
- [ ] Check if user is using VPN (legitimate use)
- [ ] Document findings

### 11. Account Review
- [ ] Review account for unauthorized access
- [ ] Check for data exfiltration
- [ ] Review account permissions
- [ ] Verify no lateral movement
- [ ] Document account status

### 12. Policy Review
- [ ] Review geolocation-based access controls
- [ ] Verify MFA implementation
- [ ] Check device trust policies
- [ ] Review VPN usage policies
- [ ] Update policies if needed

### 13. Monitoring Enhancement
- [ ] Create SIEM alert for impossible travel
- [ ] Set up geolocation-based blocking
- [ ] Implement device fingerprinting
- [ ] Configure automated response (if available)
- [ ] Document monitoring improvements

---

## Escalation Criteria

**Escalate to Security Team Lead if:**
- Privileged account affected
- Confirmed account compromise
- Data access detected
- Multiple accounts affected
- Advanced attack techniques

**Escalate to Incident Response if:**
- Confirmed account compromise
- Data exfiltration detected
- Lateral movement suspected
- APT indicators present
- Customer data at risk

---

## Ticket Documentation

### Required Fields:
- **Incident ID:** [ID]
- **Severity:** [Level]
- **Status:** [Open/In Progress/Resolved]
- **User Account:** [Account]
- **Location 1:** [Location, IP, Time]
- **Location 2:** [Location, IP, Time]
- **Travel Time:** [Calculated time]
- **Verdict:** [Legitimate/Suspicious/Compromised]
- **Actions Taken:** [List]
- **Resolution:** [Summary]

### Template:
```
IMPOSSIBLE TRAVEL INCIDENT: [ID]
SEVERITY: [Level]
STATUS: [Status]

SUMMARY:
[One sentence description]

INVESTIGATION:
- User Account: [Account]
- Location 1: [Location] ([IP]) at [Time]
- Location 2: [Location] ([IP]) at [Time]
- Distance: [Miles/KM]
- Travel Time: [Calculated time]
- Impossible: [Yes/No]
- IP Reputation: [Findings]
- Device Analysis: [Findings]
- User Verification: [Result]

IOCs:
- User Account: [Account]
- Suspicious IP: [IP Address]
- Suspicious Device: [Device fingerprint]

ACTIONS:
- [Action 1]
- [Action 2]
- [Action 3]

RESOLUTION:
[Brief resolution summary]
```

---

## Common Scenarios

### Legitimate VPN Use
- User traveling and using corporate VPN
- User working remotely from different location
- Corporate network with multiple exit points

**Action:** Verify with user, document legitimate use

### Account Compromise
- Credentials stolen and used from different location
- Session hijacking
- Credential sharing (policy violation)

**Action:** Contain account, investigate compromise, remediate

### Geolocation False Positive
- IP geolocation inaccuracy
- Mobile carrier IP routing
- Corporate network routing

**Action:** Verify actual location, update geolocation data if needed

---

## Prevention Recommendations

### Immediate:
- Enable geolocation-based access controls
- Strengthen MFA implementation
- Implement device trust policies
- Review VPN usage policies

### Short-term:
- Deploy user behavior analytics (UBA)
- Implement device fingerprinting
- Set up automated alerting
- Regular security awareness training

### Long-term:
- Zero Trust architecture implementation
- Advanced identity protection
- Continuous authentication
- Threat hunting exercises

---

## References
- [Impossible Travel Casefile Example](../004-Impossible-Travel/)
- [Log Analysis Project](../../Log-Analysis/)
- [Threat Intelligence Project](../../Threat-Intelligence/)

---

**Last Updated:** [Date]  
**Version:** 1.0
