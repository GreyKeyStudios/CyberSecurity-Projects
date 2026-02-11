# Code Examples

Python scripts and code snippets for automating SOC analyst tasks. These examples were created using AI-assisted development, then tested and validated through hands-on practice. They're designed to be educational, practical, and ready to adapt for your own use.

---

## Available Examples

### 1. IOC Enrichment Script (`ioc-enrichment.py`)

**Purpose:** Enrich indicators of compromise (IPs, domains, hashes) with threat intelligence from multiple sources.

**Features:**
- VirusTotal API integration
- AbuseIPDB lookup
- AlienVault OTX integration
- Automatic verdict generation
- JSON output for integration with other tools

**APIs Required:**
- [VirusTotal API Key](https://www.virustotal.com/gui/join-us) (Free)
- [AbuseIPDB API Key](https://www.abuseipdb.com/register) (Free)
- [AlienVault OTX API Key](https://otx.alienvault.com/) (Free)

**Setup:**
```bash
pip install requests python-dotenv

# Create .env file with your API keys
echo "VIRUSTOTAL_API_KEY=your_key_here" > .env
echo "ABUSEIPDB_API_KEY=your_key_here" >> .env
echo "OTX_API_KEY=your_key_here" >> .env

python ioc-enrichment.py
```

**Use Cases:**
- Quickly check suspicious IPs during incident response
- Enrich IOCs found in logs
- Automate threat intelligence gathering
- Generate investigation reports

---

### 2. Log Parser Examples (`log-parser-examples.py`)

**Purpose:** Parse common log formats encountered in SOC analysis.

**Supported Formats:**
- Syslog (RFC 3164)
- Windows Event Logs (CSV export)
- Apache/Nginx access logs (Common and Combined formats)
- JSON-formatted logs
- Custom formats with regex

**Features:**
- Extract failed login attempts from syslog
- Parse Windows Event Logs
- Detect suspicious HTTP requests
- Extract IOCs from logs
- Filter and search log events

**Usage:**
```bash
python log-parser-examples.py  # Run all demos

# Or import in your own scripts
from log_parser_examples import SyslogParser, WindowsEventLogParser

# Parse syslog
parsed = SyslogParser.parse_file('/var/log/syslog')

# Parse Windows Event Log CSV
events = WindowsEventLogParser.parse_csv('events.csv')
failed_logins = WindowsEventLogParser.find_failed_logins(events)
```

**Use Cases:**
- Automate log analysis
- Extract security events
- Find indicators in large log files
- Build custom log analysis tools

---

### 3. Splunk SPL Query Library (`splunk-queries.md`)

**Purpose:** Collection of battle-tested Splunk queries for common SOC investigations.

**Categories:**
- Authentication & Access (failed logins, brute force, impossible travel)
- Process Execution (PowerShell, suspicious processes, WMI)
- Network Activity (beaconing, data exfiltration, C2 detection)
- File System Activity (ransomware indicators, suspicious files)
- Malware & Threats (AV detections, persistence mechanisms)
- Time-Based Analysis (timelines, first/last seen)
- User Behavior Analytics (anomaly detection)
- Alerting Queries (ready-to-use alert conditions)

**Included Techniques:**
- Statistical anomaly detection
- Correlation and transaction analysis
- Subsearches and lookups
- Performance optimization tips
- Regex patterns in SPL

**Use Cases:**
- Quick reference during investigations
- Building custom alerts
- Learning SPL syntax
- Threat hunting queries

---

### 4. Regex IOC Extractors (`regex-extractors.py`)

**Purpose:** Extract indicators of compromise from any text using regular expressions.

**Supports:**
- IPv4 and IPv6 addresses
- Domain names
- URLs
- Email addresses
- File hashes (MD5, SHA1, SHA256)
- Windows and Unix file paths
- Registry keys
- CVE identifiers
- Bitcoin wallet addresses

**Features:**
- IOC defanging (evil.com → evil[.]com)
- IOC refanging (evil[.]com → evil.com)
- Private IP filtering
- False positive reduction
- Batch extraction from files

**Usage:**
```bash
python regex-extractors.py  # Run demo

# Or import in your own scripts
from regex_extractors import IOCExtractor, defang_ioc

# Extract all IOCs from text
text = "Contacted 203.0.113.42 and evil.com"
iocs = IOCExtractor.extract_all(text)
print(iocs)

# Defang IOCs for documentation
defanged = defang_ioc("http://evil.com")
print(defanged)  # hxxp://evil[.]com
```

**Use Cases:**
- Parse incident reports
- Extract IOCs from emails
- Analyze malware samples
- Create IOC lists from threat intel
- Automate documentation

---

## Getting Started

### Prerequisites

All examples require Python 3.7+. Install dependencies:

```bash
# For IOC enrichment
pip install requests python-dotenv

# For log parsing (no external dependencies needed)
# Uses Python standard library only

# For regex extractors (no external dependencies needed)
# Uses Python standard library only
```

### Basic Workflow

1. **Start with the demos** - Each script includes a demo function
2. **Customize for your environment** - Adapt scripts to your log formats and tools
3. **Integrate with your workflow** - Import functions into your own tools
4. **Combine multiple scripts** - Extract IOCs from logs, then enrich them

### Example Combined Workflow

```python
from log_parser_examples import SyslogParser
from regex_extractors import IOCExtractor
from ioc_enrichment import IOCEnricher

# 1. Parse logs
logs = SyslogParser.parse_file('/var/log/syslog')

# 2. Extract IOCs from log messages
all_iocs = set()
for log in logs:
    iocs = IOCExtractor.extract_all(log['message'])
    all_iocs.update(iocs.ips)

# 3. Enrich each IOC with threat intelligence
enricher = IOCEnricher()
for ip in all_iocs:
    results = enricher.enrich_ip(ip)
    print(results['verdict'])
```

---

## Tips for SOC Analysts

### Automation Best Practices

1. **Start Simple** - Begin with manual analysis, then automate repetitive tasks
2. **Log Everything** - Save script outputs for documentation and audit trails
3. **Error Handling** - Always handle API failures and malformed data gracefully
4. **Rate Limiting** - Respect API rate limits (especially for free tiers)
5. **Version Control** - Keep your scripts in git for team collaboration

### When to Use These Scripts

✅ **Good Use Cases:**
- Enriching IOCs during incident response
- Bulk log analysis
- Extracting IOCs from threat intel reports
- Building custom dashboards and reports
- Automating repetitive investigation tasks

❌ **Not Suitable For:**
- Real-time production alerting (use proper SIEM/SOAR instead)
- Processing extremely large datasets (consider big data tools)
- Mission-critical operations without proper testing

### Extending These Examples

All scripts are designed to be building blocks:

- Add more threat intel sources to IOC enrichment
- Support additional log formats in parsers
- Create new regex patterns for custom IOC types
- Combine with pandas for advanced data analysis
- Integrate with your ticketing system
- Build Slack/Teams bots using these functions

---

## Learning Resources

Want to improve your Python skills for SOC work?

- [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/) - Free book
- [Python for Security Professionals](https://www.packtpub.com/product/python-for-security-professionals) - Paid course
- [Real Python](https://realpython.com/) - Tutorials and guides
- [Python Security](https://python-security.readthedocs.io/) - Security-focused Python guide

---

## Contributing

Found a bug or have an improvement? These examples are meant to be educational starting points. Feel free to:

- Modify for your specific use case
- Add error handling for your environment
- Optimize for your data volumes
- Share improvements back to help others learn

---

## Disclaimer

These scripts are provided for educational purposes. Always:

- Test in a safe environment first
- Ensure you have permission to scan/analyze systems
- Respect API terms of service
- Follow your organization's security policies
- Don't rely solely on automated tools - always verify findings

---

*Remember: The best SOC analysts combine automation with critical thinking. Use these tools to handle repetitive tasks, so you can focus on complex analysis and decision-making.*
