# SIEM Query Notes

Common SIEM queries and search patterns for SOC analysis. Examples shown in Splunk SPL syntax but concepts apply to other SIEMs.

## Authentication & Access

### Failed Login Attempts (Brute Force Detection)
```spl
index=windows EventCode=4625
| stats count by src_ip, user, _time
| where count > 10
| sort -count
```

### Successful Admin Logons
```spl
index=windows EventCode=4624 LogonType=10 AccountType=Admin
| stats count by user, src_ip, _time
| sort -_time
```

### Multiple Failed Logons from Same IP
```spl
index=windows EventCode=4625
| stats count, values(user) as users, values(host) as hosts by src_ip
| where count > 5
| sort -count
```

### Impossible Travel Detection
```spl
index=auth user=*
| stats values(location) as locations, values(ip) as ips, min(_time) as first, max(_time) as last by user
| where locations > 1
| eval time_diff = last - first
| where time_diff < 3600  # Less than 1 hour
```

## Process & Execution

### Suspicious Process Execution
```spl
index=windows EventCode=4688
| search ProcessName IN (*cmd.exe*, *powershell.exe*, *wscript.exe*, *cscript.exe*)
| stats count by ProcessName, user, host
| sort -count
```

### PowerShell Execution
```spl
index=windows EventCode=4104
| stats count by ScriptBlockText, user, host
| sort -count
```

### Process Execution from Temp Directory
```spl
index=windows EventCode=4688
| search ProcessPath IN (*\Temp\*, *\tmp\*, *\AppData\Local\Temp\*)
| stats count by ProcessName, ProcessPath, user
```

## Network Activity

### Unusual Outbound Connections
```spl
index=network
| stats count, values(dest_port) as ports, values(dest_ip) as dest_ips by src_ip
| where count > 100
| sort -count
```

### Connections to Known Malicious IPs
```spl
index=network
| lookup threat_intel dest_ip OUTPUT threat_level
| where threat_level="malicious"
| stats count by dest_ip, src_ip
```

### High Volume Data Transfer
```spl
index=network
| stats sum(bytes_out) as total_bytes by src_ip, dest_ip
| where total_bytes > 1000000000  # > 1GB
| sort -total_bytes
```

## File System

### File Access to Sensitive Directories
```spl
index=windows EventCode=4656
| search ObjectName IN (*\SAM*, *\SECURITY*, *\SYSTEM*)
| stats count by ObjectName, user, host
```

### File Creation in System Directories
```spl
index=windows EventCode=4656
| search ObjectName IN (*\Windows\System32\*, *\Windows\SysWOW64\*)
| stats count by ObjectName, user, host
```

## Account Management

### Account Creation
```spl
index=windows EventCode=4720
| stats count by TargetUserName, _time
| sort -_time
```

### Privilege Escalation (Group Membership)
```spl
index=windows EventCode=4732
| search GroupName IN (*Administrators*, *Domain Admins*, *Enterprise Admins*)
| stats count by TargetUserName, GroupName, _time
```

### Password Reset Attempts
```spl
index=windows EventCode=4724
| stats count by TargetUserName, SubjectUserName, _time
| sort -_time
```

## Scheduled Tasks & Persistence

### Scheduled Task Creation
```spl
index=windows EventCode=4698
| stats count by TaskName, user, host
| sort -_time
```

### Service Installation
```spl
index=windows EventCode=4697
| stats count by ServiceName, user, host
| sort -_time
```

## Email Security

### Suspicious Email Patterns
```spl
index=email
| search subject IN (*urgent*, *verify*, *suspended*)
| stats count by from_address, subject
| sort -count
```

### Email with Attachments
```spl
index=email has_attachment=true
| stats count by from_address, attachment_type
| where count > 10
```

## Threat Intelligence Integration

### IOC Lookup
```spl
index=*
| lookup threat_intel ip OUTPUT threat_level, threat_type
| where threat_level="malicious"
| stats count by ip, threat_type
```

### Hash Reputation Check
```spl
index=windows EventCode=4688
| lookup hash_reputation ProcessHash OUTPUT detection_count, threat_family
| where detection_count > 5
| stats count by ProcessName, threat_family
```

## Time-Based Analysis

### Events in Last Hour
```spl
index=* earliest=-1h@h
| stats count by sourcetype, host
```

### Events by Time of Day
```spl
index=*
| eval hour=strftime(_time, "%H")
| stats count by hour, sourcetype
| sort hour
```

### Anomaly Detection (Statistical)
```spl
index=windows EventCode=4625
| stats count by src_ip, _time span=1h
| eventstats avg(count) as avg_count, stdev(count) as stddev_count by src_ip
| eval z_score = (count - avg_count) / stddev_count
| where z_score > 3  # 3 standard deviations
```

## Correlation Queries

### Failed Logon Followed by Success
```spl
index=windows (EventCode=4625 OR EventCode=4624)
| transaction src_ip, user maxspan=5m
| where eventcount > 1 AND (EventCode=4625 AND EventCode=4624)
| stats count by src_ip, user
```

### Process Creation from Email Attachment
```spl
index=email attachment_hash=*
| join attachment_hash [
    search index=windows EventCode=4688 ProcessHash=*
]
| stats count by from_address, ProcessName
```

## Performance Tips

1. **Use indexes:** Always specify index in queries
2. **Time ranges:** Use `earliest` and `latest` to limit time range
3. **Stats early:** Use `stats` to reduce data volume
4. **Field extraction:** Use `rex` for pattern matching
5. **Lookups:** Use lookup tables for threat intelligence
6. **Subsearches:** Limit subsearch results with `head` or `tail`

## Common Field Names

- `src_ip` / `source_ip` - Source IP address
- `dest_ip` / `destination_ip` - Destination IP address
- `user` / `username` - User account
- `host` / `hostname` - System hostname
- `_time` - Event timestamp
- `EventCode` - Windows Event ID
- `sourcetype` - Log source type

---

**Last Updated:** [Date]  
**Version:** 1.0
