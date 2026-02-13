# Casefile 002: Brute Force Login Attempts

## Alert Summary
**Alert Type:** Failed Authentication Attempts  
**Severity:** High  
**Source:** Windows Event Logs / SIEM  
**Date:** [Date]  
**Status:** Resolved

---

## Initial Triage

### Alert Details
- **Event ID:** 4625 (Failed Logon)
- **Count:** 150+ failed attempts in 5 minutes
- **Target Account:** `admin`
- **Source IP:** `[IP Address]`
- **Time Range:** [Start] to [End]

### Initial Assessment
- Rapid succession of failed logons indicates automated attack
- Targeting administrative account (high-value target)
- Pattern suggests brute force or password spraying

**Priority:** High — Active attack in progress

---

## Investigation

### 1. Log Analysis
**Tools Used:** Splunk, Windows Event Viewer, PowerShell

**Query Used:**
```
index=windows EventCode=4625
| stats count by src_ip, user, _time
| where count > 10
```

**Key Findings:**
- **Source IP:** `[IP Address]`
- **Target User:** `admin`
- **Failed Attempts:** 150+
- **Time Window:** 5 minutes
- **Geolocation:** [Country] (unusual for legitimate access)

### 2. Authentication Pattern Analysis
**Pattern Identified:**
- Attempts every 2-3 seconds (automated)
- Same username, varying passwords
- All attempts from single IP
- No successful logons

**Attack Type:** Brute Force (dictionary/credential stuffing)

### 3. IP Reputation Check
**Tools Used:** Threat Intelligence (AbuseIPDB, VirusTotal)

**Results:**
| Source | Verdict | Details |
|--------|---------|---------|
| AbuseIPDB | Malicious | 25 abuse reports, Category: Brute Force |
| VirusTotal | Suspicious | 8/70 engines flagged |
| Geolocation | [Country] | Unusual for legitimate access |

### 4. Account Status Check
**Target Account:** `admin`

**Findings:**
- Account is active
- No successful logons from this IP
- Account lockout policy: Not triggered (needs review)

---

## Findings

### Verdict: **ACTIVE BRUTE FORCE ATTACK**

### Indicators of Compromise (IOCs)
- **Source IP:** `[IP Address]`
- **Target Account:** `admin`
- **Attack Pattern:** Automated, high-frequency attempts
- **Geolocation:** [Country] (suspicious)

### Attack Characteristics
- **Type:** Brute Force / Credential Stuffing
- **Method:** Automated password attempts
- **Target:** Administrative account
- **Frequency:** ~30 attempts/minute
- **Duration:** 5+ minutes

### Impact Assessment
- **Risk Level:** High
- **Potential Impact:** Account compromise, lateral movement, data breach
- **Current Status:** Attack ongoing, no successful compromise detected

---

## Resolution

### Immediate Actions Taken
1. ✅ Blocked source IP at firewall
2. ✅ Enabled account lockout for target account (if not already)
3. ✅ Reviewed account for any successful logons
4. ✅ Created SIEM alert rule for similar patterns
5. ✅ Notified security team

### Recommendations
- **Immediate:** 
  - Review and strengthen account lockout policy
  - Enable MFA for administrative accounts
  - Review all accounts for similar attack patterns

- **Short-term:**
  - Implement geolocation-based blocking
  - Set up automated response for brute force detection
  - Review password policy compliance

- **Long-term:**
  - Deploy WAF/IPS rules for brute force protection
  - Implement account monitoring and alerting
  - Regular security awareness training

### Containment
- Source IP blocked at firewall
- Account lockout enabled
- Monitoring increased for target account
- No successful compromise detected

---

## Ticket Notes

```
INCIDENT: 002-Brute-Force-Login
STATUS: Resolved
SEVERITY: High

SUMMARY:
Brute force attack detected targeting admin account. 150+ failed 
authentication attempts from single IP in 5-minute window.

INVESTIGATION:
- Event ID 4625: Failed logon attempts
- Source IP: [IP Address] ([Country])
- Target: admin account
- Pattern: Automated, ~30 attempts/minute
- IP Reputation: 25 abuse reports (AbuseIPDB)

IOCs:
- Source IP: [IP Address]
- Target Account: admin
- Attack Pattern: Brute force

ACTIONS:
- Blocked source IP at firewall
- Enabled account lockout
- Reviewed account for compromise (none found)
- Created SIEM alert rule

RESOLUTION:
Attack blocked. No successful compromise. IP blocked. Account secured.
```

---

## Lessons Learned
- Account lockout policies are critical for brute force prevention
- High-frequency authentication failures are strong indicators
- IP reputation checks provide valuable context
- Administrative accounts require additional protection (MFA)
- SIEM alerting rules should be tuned for common attack patterns

---

## References
- [Log Analysis Project](../../Log-Analysis/)
- [Threat Intelligence Project](../../Threat-Intelligence/)
- [Firewall Setup Project](../../Firewall-Setup/)
