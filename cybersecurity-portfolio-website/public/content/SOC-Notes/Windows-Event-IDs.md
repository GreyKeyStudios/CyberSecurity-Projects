# Windows Event IDs Cheat Sheet

Quick reference for common Windows Event IDs used in SOC log analysis.

## Authentication Events

### Successful Logons
| Event ID | Description | Log | Use Case |
|----------|-------------|-----|----------|
| 4624 | Successful logon | Security | Track successful authentication |
| 4648 | Logon with explicit credentials | Security | Service account logons |
| 4672 | Special privileges assigned | Security | Privilege escalation |

### Failed Logons
| Event ID | Description | Log | Use Case |
|----------|-------------|-----|----------|
| 4625 | Failed logon attempt | Security | Brute force detection |
| 4648 | Explicit credentials used (failed) | Security | Failed service logon |

### Logoff Events
| Event ID | Description | Log | Use Case |
|----------|-------------|-----|----------|
| 4634 | Account logged off | Security | Track session duration |
| 4647 | User initiated logoff | Security | Normal logoff |

## Account Management

| Event ID | Description | Log | Use Case |
|----------|-------------|-----|----------|
| 4720 | User account created | Security | Unauthorized account creation |
| 4722 | User account enabled | Security | Account activation |
| 4724 | Password reset attempt | Security | Password reset monitoring |
| 4726 | User account deleted | Security | Account deletion tracking |
| 4732 | Member added to security group | Security | Privilege escalation |
| 4733 | Member removed from security group | Security | Privilege reduction |

## Process & Service Events

| Event ID | Description | Log | Use Case |
|----------|-------------|-----|----------|
| 4688 | New process created | Security | Process monitoring, malware detection |
| 4697 | Service installed | Security | Unauthorized service installation |
| 4698 | Scheduled task created | Security | Persistence mechanism detection |
| 4702 | Scheduled task updated | Security | Task modification tracking |

## Network Events

| Event ID | Description | Log | Use Case |
|----------|-------------|-----|----------|
| 5156 | Windows Firewall allowed connection | Security | Firewall rule tracking |
| 5157 | Windows Firewall blocked connection | Security | Blocked connection analysis |
| 5158 | Windows Firewall rule modified | Security | Firewall rule changes |

## File & Object Access

| Event ID | Description | Log | Use Case |
|----------|-------------|-----|----------|
| 4656 | Handle to object requested | Security | File access tracking (requires auditing) |
| 4658 | Handle to object closed | Security | File access completion |
| 4663 | Attempt to access object | Security | Failed access attempts |

## System Events

| Event ID | Description | Log | Use Case |
|----------|-------------|-----|----------|
| 1074 | System shutdown initiated | System | Unauthorized shutdowns |
| 6005 | Event log service started | System | System startup tracking |
| 6006 | Event log service stopped | System | System shutdown tracking |
| 6008 | Previous shutdown was unexpected | System | System crash detection |

## PowerShell & Scripting

| Event ID | Description | Log | Use Case |
|----------|-------------|-----|----------|
| 4103 | PowerShell script block logged | PowerShell | Script execution monitoring |
| 4104 | PowerShell script execution | PowerShell | Malicious script detection |
| 4105 | PowerShell command execution | PowerShell | Command monitoring |

## Common SOC Queries

### Failed Logon Attempts (Brute Force)
```
EventCode=4625
| stats count by src_ip, user, _time
| where count > 10
```

### Successful Admin Logons
```
EventCode=4624 LogonType=10 AccountType=Admin
| stats count by user, src_ip
```

### Process Creation (Suspicious)
```
EventCode=4688
| search ProcessName IN (*cmd.exe*, *powershell.exe*, *wscript.exe*)
| stats count by ProcessName, user
```

### Account Creation
```
EventCode=4720
| stats count by TargetUserName, _time
```

### Scheduled Task Creation
```
EventCode=4698
| stats count by TaskName, user
```

## Logon Types Reference

| Logon Type | Description | Common Use |
|------------|-------------|------------|
| 2 | Interactive | Local logon |
| 3 | Network | Network share access |
| 4 | Batch | Scheduled task |
| 5 | Service | Service account |
| 7 | Unlock | Screen unlock |
| 8 | NetworkCleartext | Network logon (unencrypted) |
| 9 | NewCredentials | RunAs with new credentials |
| 10 | RemoteInteractive | RDP logon |
| 11 | CachedInteractive | Cached credentials |

## Security Event Log Locations

- **Security Log:** `C:\Windows\System32\winevt\Logs\Security.evtx`
- **System Log:** `C:\Windows\System32\winevt\Logs\System.evtx`
- **Application Log:** `C:\Windows\System32\winevt\Logs\Application.evtx`
- **PowerShell Log:** `C:\Windows\System32\winevt\Logs\Microsoft-Windows-PowerShell%4Operational.evtx`

## Tools for Analysis

- **Event Viewer:** Built-in Windows tool
- **PowerShell:** `Get-WinEvent` cmdlet
- **Splunk:** Windows Event Log add-on
- **ELK Stack:** Winlogbeat for log collection
- **Sysmon:** Enhanced logging (requires installation)

---

**Last Updated:** [Date]  
**Version:** 1.0
