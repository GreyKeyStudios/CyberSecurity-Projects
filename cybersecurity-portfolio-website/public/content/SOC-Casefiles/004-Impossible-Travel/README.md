# Casefile 004: Impossible Travel Detection

## Alert Summary
**Alert Type:** Identity Anomaly  
**Severity:** Medium  
**Source:** Identity Provider / SIEM  
**Date:** [Date]  
**Status:** Resolved

---

## Initial Triage

### Alert Details
- **Alert Name:** "Impossible Travel Detected"
- **User:** `jsmith@company.com`
- **Location 1:** Minneapolis, MN, USA (09:00)
- **Location 2:** London, UK (09:15)
- **Time Difference:** 15 minutes
- **Distance:** ~3,800 miles
- **Impossible:** Yes (cannot travel that distance in 15 minutes)

### Initial Assessment
- User authenticated from two geographically distant locations
- Time difference suggests account compromise or credential sharing
- Requires investigation to determine legitimate vs. malicious

**Priority:** Medium — Potential account compromise

---

## Investigation

### 1. Authentication Log Analysis
**Tools Used:** Identity Provider logs, SIEM

**Query Used:**
```
index=auth user=jsmith@company.com
| stats values(location) as locations, values(ip) as ips by _time
| where locations > 1
```

**Key Findings:**
- **User:** `jsmith@company.com`
- **IP 1:** `[IP1]` (Minneapolis, MN)
- **IP 2:** `[IP2]` (London, UK)
- **Time Gap:** 15 minutes
- **Authentication Method:** Password + MFA (both locations)

### 2. IP Reputation Check
**Tools Used:** Threat Intelligence (AbuseIPDB, VirusTotal, MaxMind)

**Results:**

| IP | Location | Reputation | Details |
|----|----------|------------|---------|
| `[IP1]` | Minneapolis, MN | Clean | Known corporate VPN endpoint |
| `[IP2]` | London, UK | Suspicious | 3 abuse reports, VPN service |

### 3. User Account Review
**User:** `jsmith@company.com`

**Account Details:**
- **Role:** Sales Manager
- **Last Password Change:** [Date]
- **MFA Status:** Enabled
- **Recent Activity:** Normal (except for this alert)
- **Travel Status:** No known travel to UK

### 4. Device Analysis
**Devices Used:**
- **Device 1 (Minneapolis):** Corporate laptop (known device)
- **Device 2 (London):** Unknown device / Browser fingerprint mismatch

### 5. Session Analysis
**Session Details:**
- **Session 1 (Minneapolis):** Active, legitimate
- **Session 2 (London):** New session, different user agent
- **Concurrent Sessions:** Yes (both active simultaneously)

---

## Findings

### Verdict: **SUSPICIOUS ACTIVITY — ACCOUNT COMPROMISE LIKELY**

### Indicators of Compromise (IOCs)
- **User Account:** `jsmith@company.com`
- **Suspicious IP:** `[IP2]` (London, UK)
- **Suspicious Device:** Unknown device fingerprint
- **Behavior:** Impossible travel pattern

### Possible Scenarios
1. **Account Compromise:** Credentials stolen, attacker using VPN
2. **Credential Sharing:** User sharing credentials (policy violation)
3. **Session Hijacking:** Stolen session token (less likely with MFA)

### Impact Assessment
- **Risk Level:** Medium-High
- **Potential Impact:** Unauthorized access, data exfiltration, lateral movement
- **Current Status:** Suspicious session active

---

## Resolution

### Immediate Actions Taken
1. ✅ Suspicious session terminated
2. ✅ User account password reset required
3. ✅ MFA reset (new device registration required)
4. ✅ User notified and interviewed
5. ✅ All active sessions reviewed
6. ✅ Account activity reviewed for data access

### User Interview Results
**User Response:**
- User confirmed legitimate access from Minneapolis
- User denied access from London
- User reported no travel to UK
- User confirmed no credential sharing

**Conclusion:** Account compromise confirmed

### Additional Actions
- ✅ All active sessions terminated
- ✅ Password reset enforced
- ✅ MFA re-registration required
- ✅ Account activity logs reviewed (no data exfiltration detected)
- ✅ Suspicious IP blocked
- ✅ User security awareness training scheduled

### Recommendations
- **Immediate:**
  - Review all user accounts for similar patterns
  - Strengthen MFA policy (device trust)
  - Implement geolocation-based access controls

- **Short-term:**
  - Deploy user behavior analytics (UBA)
  - Implement device fingerprinting
  - Review password policy and MFA configuration

- **Long-term:**
  - Regular security awareness training
  - Phishing simulation exercises
  - Zero Trust architecture implementation

### Containment
- Suspicious session terminated
- Account secured (password + MFA reset)
- No data exfiltration detected
- User account reviewed and secured

---

## Ticket Notes

```
INCIDENT: 004-Impossible-Travel
STATUS: Resolved
SEVERITY: Medium

SUMMARY:
Impossible travel detected for user jsmith@company.com. 
Authentication from Minneapolis and London within 15 minutes.

INVESTIGATION:
- User: jsmith@company.com
- Location 1: Minneapolis, MN (09:00) - Legitimate
- Location 2: London, UK (09:15) - Suspicious
- IP Reputation: [IP2] has 3 abuse reports, VPN service
- Device: Unknown device fingerprint (London)
- User Interview: Denied access from London

IOCs:
- User Account: jsmith@company.com
- Suspicious IP: [IP2] (London, UK)
- Suspicious Device: Unknown fingerprint

ACTIONS:
- Suspicious session terminated
- Password reset enforced
- MFA re-registration required
- Account activity reviewed (no data exfiltration)
- Suspicious IP blocked
- User training scheduled

RESOLUTION:
Account compromise confirmed. Account secured. No data loss. 
User trained. Monitoring increased.
```

---

## Lessons Learned
- Impossible travel detection is effective for identifying account compromise
- MFA alone is not sufficient if session tokens are compromised
- User interviews are critical for understanding context
- Device fingerprinting helps identify suspicious access
- Geolocation-based controls can prevent unauthorized access

---

## References
- [Log Analysis Project](../../Log-Analysis/)
- [Threat Intelligence Project](../../Threat-Intelligence/)
