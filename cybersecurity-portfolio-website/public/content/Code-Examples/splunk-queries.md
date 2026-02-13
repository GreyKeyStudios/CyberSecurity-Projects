# Splunk SPL Query Library

A collection of useful Splunk Search Processing Language (SPL) queries for SOC investigations and threat hunting.

---

## Table of Contents

1. [Authentication & Access](#authentication--access)
2. [Process Execution](#process-execution)
3. [Network Activity](#network-activity)
4. [File System Activity](#file-system-activity)
5. [Malware & Threats](#malware--threats)
6. [Time-Based Analysis](#time-based-analysis)
7. [User Behavior Analytics](#user-behavior-analytics)
8. [Alerting Queries](#alerting-queries)

---

## Authentication & Access

### Failed Login Attempts

```spl
index=windows EventCode=4625
| stats count by src_ip, user, _time
| where count > 5
| sort - count
```

### Successful Login After Failed Attempts (Potential Brute Force)

```spl
index=windows (EventCode=4625 OR EventCode=4624)
| transaction src_ip, user maxspan=5m
| search EventCode=4625 AND EventCode=4624
| table _time, src_ip, user, EventCode
```

### Account Lockouts

```spl
index=windows EventCode=4740
| stats count by user, src_ip
| sort - count
```

### Logins Outside Business Hours

```spl
index=windows EventCode=4624
| eval hour=strftime(_time, "%H")
| where hour < 7 OR hour > 18
| stats count by user, src_ip, hour
| sort - count
```

### Impossible Travel (Same User, Different Locations)

```spl
index=windows EventCode=4624 user=*
| iplocation src_ip
| eval location=Country + ", " + City
| transaction user maxpause=1h
| where mvcount(location) > 1
| table _time, user, src_ip, location
```

### Privileged Account Usage

```spl
index=windows EventCode=4672
| stats count by user, ComputerName
| sort - count
```

---

## Process Execution

### PowerShell Execution with Encoded Commands

```spl
index=windows EventCode=4104 OR EventCode=4688
| search (powershell.exe AND ("-enc" OR "-encodedcommand" OR "frombase64"))
| table _time, ComputerName, user, CommandLine
```

### Suspicious Process Creation

```spl
index=windows EventCode=4688
| search (Process_Name IN ("cmd.exe", "powershell.exe", "wscript.exe", "cscript.exe"))
| search ParentProcessName IN ("winword.exe", "excel.exe", "outlook.exe", "acrord32.exe")
| table _time, ComputerName, user, ParentProcessName, Process_Name, CommandLine
```

### WMI Process Creation

```spl
index=windows EventCode=4688 ParentProcessName="*WmiPrvSE.exe"
| table _time, ComputerName, user, Process_Name, CommandLine
```

### Scheduled Task Creation

```spl
index=windows EventCode=4698
| table _time, ComputerName, user, TaskName, TaskContent
```

### Service Installation

```spl
index=windows EventCode=7045
| table _time, ComputerName, ServiceName, ImagePath, ServiceType
```

---

## Network Activity

### Outbound Connections to Rare Destinations

```spl
index=network action=allowed
| stats dc(dest_ip) as unique_dests by src_ip
| where unique_dests < 5
| table src_ip, unique_dests
```

### Large Data Transfers (Potential Exfiltration)

```spl
index=firewall action=allowed
| stats sum(bytes_out) as total_bytes by src_ip, dest_ip
| where total_bytes > 10000000
| eval total_MB=round(total_bytes/1024/1024, 2)
| table src_ip, dest_ip, total_MB
| sort - total_MB
```

### Communication with Known Malicious IPs

```spl
index=firewall
| lookup threat_intel_list ip as dest_ip OUTPUT threat_level
| where threat_level="high"
| table _time, src_ip, dest_ip, dest_port, threat_level
```

### DNS Queries to Suspicious Domains

```spl
index=dns
| search query=*".ru" OR query=*".cn" OR query=*".tk"
| stats count by query, src_ip
| where count < 10
| sort - count
```

### Beaconing Detection (Regular C2 Communication)

```spl
index=network dest_port=* src_ip=*
| bucket _time span=1h
| stats count by _time, src_ip, dest_ip, dest_port
| eventstats avg(count) as avg, stdev(count) as stdev by src_ip, dest_ip, dest_port
| where count > (avg + 2*stdev)
| table _time, src_ip, dest_ip, dest_port, count
```

---

## File System Activity

### Files Created in Suspicious Locations

```spl
index=windows EventCode=11
| search (TargetFilename="*\\Windows\\Temp\\*" OR TargetFilename="*\\AppData\\Roaming\\*")
| search (TargetFilename="*.exe" OR TargetFilename="*.dll" OR TargetFilename="*.bat")
| table _time, ComputerName, user, TargetFilename
```

### Mass File Modification (Ransomware Indicator)

```spl
index=windows EventCode=5145
| bucket _time span=1m
| stats count by _time, user, ComputerName
| where count > 100
| table _time, user, ComputerName, count
```

### Executable Files Downloaded from Internet

```spl
index=proxy action=allowed
| search (uri_path="*.exe" OR uri_path="*.dll" OR uri_path="*.bat")
| table _time, src_ip, user, uri, uri_path, bytes_out
```

---

## Malware & Threats

### Antivirus Detections

```spl
index=antivirus action=blocked
| stats count by signature, src_host, user
| sort - count
```

### Sysmon - Process Injection Detection

```spl
index=windows EventCode=8
| table _time, ComputerName, SourceImage, TargetImage, user
```

### Registry Modifications (Persistence)

```spl
index=windows EventCode=13
| search (TargetObject="*\\Microsoft\\Windows\\CurrentVersion\\Run*" OR 
         TargetObject="*\\Microsoft\\Windows\\CurrentVersion\\RunOnce*")
| table _time, ComputerName, user, TargetObject, Details
```

### Suspicious DLL Loads

```spl
index=windows EventCode=7
| search NOT (ImageLoaded="C:\\Windows\\*" OR ImageLoaded="C:\\Program Files\\*")
| table _time, ComputerName, user, Image, ImageLoaded
```

---

## Time-Based Analysis

### Event Timeline for Specific Host

```spl
index=* host="SERVER01"
| sort _time
| table _time, sourcetype, EventCode, user, message
```

### Activity During Specific Time Window

```spl
index=windows
earliest="2024-01-15T10:00:00" latest="2024-01-15T11:00:00"
| stats count by sourcetype, EventCode
| sort - count
```

### First and Last Seen Activity

```spl
index=windows user="jsmith"
| stats earliest(_time) as first_seen, latest(_time) as last_seen by user, ComputerName
| eval first_seen=strftime(first_seen, "%Y-%m-%d %H:%M:%S")
| eval last_seen=strftime(last_seen, "%Y-%m-%d %H:%M:%S")
| table user, ComputerName, first_seen, last_seen
```

---

## User Behavior Analytics

### Users with Most Failed Authentications

```spl
index=windows EventCode=4625
| stats count by user
| sort - count
| head 10
```

### Users Accessing Multiple Systems

```spl
index=windows EventCode=4624
| stats dc(ComputerName) as system_count by user
| where system_count > 20
| sort - system_count
```

### Rare User-Agent Strings

```spl
index=proxy
| rare useragent limit=20
| table useragent, count, percent
```

### Account Changes

```spl
index=windows (EventCode=4720 OR EventCode=4722 OR EventCode=4724 OR EventCode=4738)
| eval action=case(
    EventCode=4720, "Account Created",
    EventCode=4722, "Account Enabled",
    EventCode=4724, "Password Reset",
    EventCode=4738, "Account Modified"
)
| table _time, action, user, TargetUserName, src_ip
```

---

## Alerting Queries

### Multiple Failed Logins (Alert Condition)

```spl
index=windows EventCode=4625
| bucket _time span=5m
| stats count by _time, src_ip, user
| where count > 10
```

### New Admin Account Created

```spl
index=windows EventCode=4720
| search MemberOf="*Administrators*"
| table _time, TargetUserName, SubjectUserName, ComputerName
```

### Service Account Logging In Interactively

```spl
index=windows EventCode=4624 LogonType=2
| search user="svc_*"
| table _time, user, src_ip, ComputerName
```

### Firewall Rule Changes

```spl
index=windows EventCode=4947
| table _time, ComputerName, RuleName, RuleId, user
```

---

## Advanced Techniques

### Subsearch - Find Users with Both Failed and Successful Logins

```spl
index=windows EventCode=4624
[search index=windows EventCode=4625 
| stats count by user 
| where count > 5 
| fields user]
| stats count by user, src_ip
```

### Transaction - Correlate Multiple Events

```spl
index=windows (EventCode=4624 OR EventCode=4634)
| transaction user, ComputerName startswith=(EventCode=4624) endswith=(EventCode=4634)
| eval session_duration=duration/60
| where session_duration < 1
| table _time, user, ComputerName, session_duration
```

### Statistical Anomaly Detection

```spl
index=windows EventCode=4624
| bucket _time span=1h
| stats count by _time, user
| eventstats avg(count) as avg, stdev(count) as stdev by user
| eval anomaly_score=(count-avg)/stdev
| where anomaly_score > 3
| table _time, user, count, avg, anomaly_score
```

### Lookup Table Enrichment

```spl
index=windows EventCode=4624
| lookup user_list.csv user OUTPUT department, manager, risk_level
| where risk_level="high"
| table _time, user, src_ip, department, manager
```

---

## Performance Optimization Tips

### Use Index and Time Range

```spl
# Good
index=windows earliest=-24h EventCode=4625

# Bad (searches all indexes and all time)
EventCode=4625
```

### Use Fields Command to Reduce Data

```spl
index=windows EventCode=4625
| fields _time, user, src_ip, ComputerName
| stats count by user, src_ip
```

### Use tstats for Faster Searches (Indexed Fields Only)

```spl
| tstats count WHERE index=windows EventCode=4625 BY user, src_ip
```

### Use Streaming Commands When Possible

```spl
# Streaming (faster)
index=windows EventCode=4625
| eval hour=strftime(_time, "%H")
| where hour > 18

# Non-streaming (slower)
index=windows EventCode=4625
| stats count by user
| where count > 10
```

---

## Common Transforming Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `stats` | Aggregate data | `stats count by user` |
| `chart` | Create time-series charts | `chart count by _time, user` |
| `timechart` | Time-based charts | `timechart count by user` |
| `table` | Display specific fields | `table user, src_ip, _time` |
| `sort` | Sort results | `sort - count` (descending) |
| `head` | Show first N results | `head 10` |
| `tail` | Show last N results | `tail 10` |
| `dedup` | Remove duplicates | `dedup user` |
| `transaction` | Group related events | `transaction user maxspan=5m` |
| `eval` | Create calculated fields | `eval mb=bytes/1024/1024` |
| `where` | Filter results | `where count > 10` |
| `lookup` | Enrich with external data | `lookup threat_list ip` |

---

## Useful eval Functions

```spl
# Convert timestamp
eval time_readable=strftime(_time, "%Y-%m-%d %H:%M:%S")

# Math operations
eval total_mb=bytes/1024/1024
eval percentage=(failed_count/total_count)*100

# String operations
eval domain=mvindex(split(email, "@"), 1)
eval uppercase_user=upper(user)
eval contains_admin=if(like(user, "%admin%"), "yes", "no")

# Conditional logic
eval risk_level=case(
    score > 80, "High",
    score > 50, "Medium",
    score > 20, "Low",
    1=1, "Minimal"
)

# IP operations
eval is_private=if(cidrmatch("10.0.0.0/8", src_ip) OR 
                   cidrmatch("172.16.0.0/12", src_ip) OR 
                   cidrmatch("192.168.0.0/16", src_ip), "yes", "no")
```

---

## Regex in Splunk

```spl
# Extract domain from email
index=email
| rex field=from "(?<domain>[^@]+@(?<domain_name>[^>]+))"
| table from, domain_name

# Extract IP from message
index=logs
| rex field=message "IP:\s+(?<extracted_ip>\d+\.\d+\.\d+\.\d+)"
| table _time, message, extracted_ip

# Match pattern
index=logs
| regex message="^Error.*database.*"
| table _time, message
```

---

## Creating Alerts in Splunk

1. Save your search
2. Click "Save As" → "Alert"
3. Configure trigger conditions
4. Set up actions (email, webhook, script)

**Example Alert:**
```spl
index=windows EventCode=4625
| bucket _time span=5m
| stats count by _time, src_ip, user
| where count > 10
```

**Trigger:** When results > 0
**Action:** Send email with results

---

*Remember: Always test queries in a development environment first, and use time ranges to limit search scope during investigations.*
