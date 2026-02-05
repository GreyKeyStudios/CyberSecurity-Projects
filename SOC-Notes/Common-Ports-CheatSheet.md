# Common Ports Cheat Sheet

Quick reference for common network ports and their typical uses in SOC analysis.

## Well-Known Ports (0-1023)

| Port | Protocol | Service | Common Use | Security Notes |
|------|----------|---------|-----------|----------------|
| 20 | TCP | FTP Data | File Transfer | Often blocked, use SFTP |
| 21 | TCP | FTP Control | File Transfer | Unencrypted, security risk |
| 22 | TCP | SSH | Secure Shell | Secure remote access |
| 23 | TCP | Telnet | Remote Access | Unencrypted, security risk |
| 25 | TCP | SMTP | Email (Outgoing) | Email server communication |
| 53 | TCP/UDP | DNS | Domain Name System | Critical for network operations |
| 80 | TCP | HTTP | Web Traffic | Unencrypted web traffic |
| 88 | TCP/UDP | Kerberos | Authentication | Windows domain authentication |
| 110 | TCP | POP3 | Email (Incoming) | Email retrieval |
| 135 | TCP | RPC | Remote Procedure Call | Windows services |
| 139 | TCP | NetBIOS | Network File Sharing | Windows file sharing |
| 143 | TCP | IMAP | Email (Incoming) | Email retrieval |
| 443 | TCP | HTTPS | Secure Web Traffic | Encrypted web traffic |
| 445 | TCP | SMB | Server Message Block | Windows file sharing |
| 993 | TCP | IMAPS | Secure IMAP | Encrypted email |
| 995 | TCP | POP3S | Secure POP3 | Encrypted email |

## Registered Ports (1024-49151)

| Port | Protocol | Service | Common Use | Security Notes |
|------|----------|---------|-----------|----------------|
| 1433 | TCP | MSSQL | Microsoft SQL Server | Database access |
| 1521 | TCP | Oracle | Oracle Database | Database access |
| 3306 | TCP | MySQL | MySQL Database | Database access |
| 3389 | TCP | RDP | Remote Desktop Protocol | Windows remote desktop |
| 5432 | TCP | PostgreSQL | PostgreSQL Database | Database access |
| 5900 | TCP | VNC | Virtual Network Computing | Remote desktop |
| 8080 | TCP | HTTP-Proxy | Web Proxy | Alternative HTTP port |
| 8443 | TCP | HTTPS-Alt | Alternative HTTPS | Alternative HTTPS port |

## Common Malicious Ports

| Port | Protocol | Common Malware | Notes |
|------|----------|----------------|-------|
| 4444 | TCP | Metasploit | Common backdoor port |
| 5555 | TCP | Android ADB | Android debugging (can be abused) |
| 6666-6669 | TCP | IRC | Internet Relay Chat (malware C2) |
| 8080 | TCP | Various | Common malware C2 port |
| 31337 | TCP | Back Orifice | Classic backdoor port |

## SOC Analysis Tips

### Suspicious Port Activity
- **Non-standard ports for common services:** HTTP on port 8080, 8443, etc.
- **High-numbered ports (>49151):** Often used by malware to avoid detection
- **Ports commonly used by malware:** 4444, 5555, 6666-6669, 31337
- **Unexpected outbound connections:** May indicate data exfiltration

### Common Attack Patterns
- **Port scanning:** Sequential connection attempts to multiple ports
- **Brute force:** Repeated connection attempts to same port (SSH 22, RDP 3389)
- **Backdoor ports:** Unusual ports with active connections
- **Data exfiltration:** Large outbound connections on non-standard ports

### Firewall Rules
- **Default deny:** Block all inbound, allow specific outbound
- **Whitelist approach:** Only allow necessary ports
- **Monitor outbound:** Track unusual outbound connections
- **Log everything:** Log all blocked/allowed connections for analysis

## Quick Reference Commands

### Check Listening Ports
```bash
# Linux
netstat -tulpn
ss -tulpn

# Windows
netstat -ano
```

### Check Connections
```bash
# Linux
netstat -an | grep ESTABLISHED
ss -tun

# Windows
netstat -an | findstr ESTABLISHED
```

### Port Scanning (Authorized Testing Only)
```bash
# Nmap
nmap -p 1-1000 target-ip
nmap -p- target-ip  # All ports
```

---

**Last Updated:** [Date]  
**Version:** 1.0
