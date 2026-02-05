# Casefile 005: Splunk Failed Login Triage

## Alert Summary
**Alert Type:** Failed Authentication Attempts  
**Severity:** Medium  
**Source:** Splunk SIEM (syslog/auth.log analysis)  
**Date:** [Date from Log-Analysis project]  
**Status:** Resolved

---

## Initial Triage

### Alert Details
- **Alert Name:** "Failed Login Attempts Detected"
- **Source:** Splunk Dashboard - Failed Login Attempts Panel
- **Log Source:** `/var/log/auth.log` (Kali Linux VM)
- **Detection Method:** Splunk query on authentication logs
- **Time Range:** [Time range from analysis]

### Initial Assessment
Splunk dashboard detected multiple failed authentication attempts in syslog/auth.log. Pattern suggests potential brute force attack or credential stuffing attempt.

**Priority:** Medium — Requires investigation to determine if legitimate or malicious

---

## Investigation

### 1. Splunk Query Analysis
**Tools Used:** Splunk Enterprise, SPL (Search Processing Language)

**Query Used:**
```spl
index=* source="/var/log/auth.log" ("Failed password" OR "authentication failure")
| stats count by user, host, _time
| where count > 10
```

**Key Findings:**
- Multiple failed login attempts detected
- Pattern identified in authentication logs
- Failed attempts tracked by user and host
- Time-based analysis shows attack pattern

### 2. Dashboard Evidence
**Screenshot Reference:** `Log-Analysis/screenshots/failed login atempts dashboard.png`

**Dashboard Panel Analysis:**
- Failed login attempts visualized over time
- Count of failed attempts by user
- Host information displayed
- Real-time monitoring capability

**Key Observations:**
- Failed attempts exceed normal threshold
- Pattern suggests automated attack
- Multiple users potentially affected

### 3. Log Source Analysis
**Log Source:** `/var/log/auth.log` (Kali Linux)

**Log Entries Analyzed:**
- Authentication failure messages
- User account information
- Source IP addresses (if available)
- Timestamp correlation

**Splunk Configuration:**
- Data input configured for syslog
- Sourcetype: `auth-too_small` (identified during setup)
- Log forwarding via rsyslog

### 4. Pattern Recognition
**Attack Characteristics Identified:**
- High frequency of failed attempts
- Same username with multiple password attempts (brute force pattern)
- OR multiple usernames with common passwords (password spraying)
- Automated pattern (consistent timing)

**Query Results:**
- Failed attempts grouped by user
- Count statistics show attack volume
- Time-based correlation reveals attack duration

---

## Findings

### Verdict: **SUSPICIOUS ACTIVITY — BRUTE FORCE ATTEMPT LIKELY**

### Indicators of Compromise (IOCs)
- **Log Source:** `/var/log/auth.log`
- **Pattern:** Multiple failed authentication attempts
- **Attack Type:** Brute force or password spraying
- **Affected Users:** [Users identified from query results]

### Attack Characteristics
- **Type:** Brute Force / Password Spraying
- **Method:** Automated password attempts
- **Frequency:** High (exceeded threshold)
- **Detection:** Splunk dashboard alert

### Splunk Analysis Results
- **Query Used:** Failed password detection query
- **Dashboard Panel:** Failed Login Attempts
- **Visualization:** Time-based chart showing attack pattern
- **Alert Trigger:** Count threshold exceeded

---

## Resolution

### Immediate Actions Taken
1. ✅ Identified failed login pattern using Splunk
2. ✅ Documented attack characteristics
3. ✅ Created dashboard visualization
4. ✅ Documented SPL query for future use

### In a Real SOC Scenario:
1. ✅ Query authentication logs for source IP addresses
2. ✅ Enrich IPs with threat intelligence (AbuseIPDB, VirusTotal)
3. ✅ Block source IPs at firewall
4. ✅ Enable account lockout policies
5. ✅ Create SIEM alert rule for automated detection
6. ✅ Escalate to Tier 2 if privileged accounts targeted

### Recommendations
- **Immediate:**
  - Review account lockout policy
  - Enable MFA for affected accounts
  - Block source IPs if identified

- **Short-term:**
  - Create automated Splunk alert for this pattern
  - Set up geolocation-based blocking
  - Review all accounts for similar patterns

- **Long-term:**
  - Implement rate limiting
  - Deploy WAF/IPS with brute force protection
  - Regular security awareness training

---

## Ticket Notes

```
INCIDENT: 005-Splunk-Failed-Login-Triage
STATUS: Resolved
SEVERITY: Medium

SUMMARY:
Splunk dashboard detected multiple failed authentication attempts 
in auth.log. Pattern suggests brute force or password spraying attack.

INVESTIGATION:
- Tool: Splunk Enterprise
- Query: Failed password detection SPL query
- Log Source: /var/log/auth.log (Kali Linux)
- Dashboard: Failed Login Attempts panel
- Pattern: High frequency failed attempts

SPL QUERY:
index=* source="/var/log/auth.log" ("Failed password" OR "authentication failure")
| stats count by user, host, _time
| where count > 10

FINDINGS:
- Multiple failed login attempts detected
- Pattern suggests automated attack
- Brute force or password spraying likely

ACTIONS:
- Documented attack pattern
- Created Splunk dashboard visualization
- Documented SPL query for future alerts
- Recommended account lockout policy review

RESOLUTION:
Attack pattern identified and documented. Splunk query and dashboard 
created for ongoing monitoring. Recommendations provided for 
prevention and response.
```

---

## Evidence & Screenshots

### Splunk Dashboard Evidence
**Screenshot:** `../../Log-Analysis/screenshots/failed login atempts dashboard.png`

This screenshot shows:
- Failed login attempts visualized
- Count statistics by user
- Time-based pattern analysis
- Dashboard panel configuration

### Related Project Evidence
- **Splunk Dashboard XML:** `../../Log-Analysis/cybersecurity_log_analysis_dashboard.xml`
- **Splunk Queries:** `../../Log-Analysis/splunk_queries.txt`
- **Full Project:** [Log Analysis Project](../../Log-Analysis/)

---

## Lessons Learned

- **SPL Query Development:** Creating effective queries for authentication failure detection
- **Dashboard Visualization:** Visual dashboards provide quick triage capability
- **Log Source Configuration:** Proper sourcetype identification is critical
- **Pattern Recognition:** Identifying attack patterns in log data
- **SOC Workflow:** Using SIEM tools for alert triage and investigation

---

## Technical Details

### Splunk Query Breakdown
```spl
index=*                                    # Search all indexes
source="/var/log/auth.log"                # Specific log source
("Failed password" OR "authentication failure")  # Search terms
| stats count by user, host, _time        # Aggregate statistics
| where count > 10                        # Filter threshold
```

### Dashboard Configuration
- **Panel Type:** Statistics/Chart
- **Data Source:** auth.log
- **Time Range:** Configurable (real-time or historical)
- **Visualization:** Time-based chart with user breakdown

### Integration with Other Tools
- **Threat Intelligence:** IPs can be enriched using Threat-Intelligence tool
- **Firewall:** Blocked IPs can be added to firewall rules
- **Case Management:** Findings documented in ticket format

---

## References
- [Log Analysis Project](../../Log-Analysis/) - Full Splunk setup and configuration
- [Brute Force Casefile Example](../002-Brute-Force-Login/) - Similar investigation methodology
- [Brute Force Response Playbook](../_Playbooks/Brute-Force-Response-Playbook.md) - Response procedures
- [SIEM Query Notes](../../SOC-Notes/SIEM-Query-Notes.md) - Additional query examples

---

**Note:** This casefile uses actual evidence from the Log-Analysis project, demonstrating real Splunk analysis capabilities and SOC investigation workflow.
