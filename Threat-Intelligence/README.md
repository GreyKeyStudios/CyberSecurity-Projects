# 🛰️ Automated Threat Intelligence Lab

An automated tool for gathering, analyzing, and reporting Indicators of Compromise (IOCs) using open-source threat intelligence APIs including **VirusTotal**, **AlienVault OTX**, and **AbuseIPDB**.

> 🎯 Designed to demonstrate scripting, API integration, and threat intel workflows using Python.

---

## 🚀 Features

- Query multiple threat intelligence APIs for:
  - File hashes (MD5, SHA1, SHA256)
  - IP addresses
  - Domains
- Aggregate and normalize data from:
  - VirusTotal
  - AbuseIPDB
  - AlienVault OTX
- Export results in CSV, JSON, or Markdown report format
- Append to existing databases for historical tracking
- Modular and extensible design

---

## 🧰 Tools Used

- Python 3.x
- [VirusTotal API](https://www.virustotal.com/gui/home/search)
- [AlienVault OTX API](https://otx.alienvault.com/)
- [AbuseIPDB API](https://www.abuseipdb.com/)
- `pandas` for data handling
- `python-dotenv` for config management

---

## 📁 Folder Structure

Threat-Intelligence/
├── data/ # Output files (CSV/JSON)
├── logs/ # Log files
├── reports/ # Markdown reports
├── scripts/
│ ├── main.py # Main CLI logic
│ └── utils.py # Helper functions
├── tests/ # Unit tests (WIP)
├── .env.example # Template for API keys
├── requirements.txt # Python dependencies
└── README.md # Project documentation

---

## ⚙️ Setup

1. Clone the repo:

```bash
git clone https://github.com/GreyKeyStudios/CyberSecurity-Projects.git
cd CyberSecurity-Projects/Threat-Intelligence

Install dependencies:
pip install -r requirements.txt

Add your API keys to a .env file:
VIRUSTOTAL_API_KEY=your_virustotal_api_key
ABUSEIPDB_API_KEY=your_abuseipdb_api_key
OTX_API_KEY=your_otx_api_key

⚡ Usage
Check a file hash:
python scripts/main.py --hash <HASH>

Check a domain:
python scripts/main.py --domain shady-site.biz

Check an IP address:
python scripts/main.py --ip 185.130.5.231

Check all with a label and output to CSV:
python scripts/main.py --threat-type "Phishing Kit" --hash <HASH> --domain shady.biz --ip 185.130.5.231 --output csv

📊 Sample Output
CSV
Source,IOC Type,IOC Value,Threat Label,First Seen
VirusTotal,hash,e99a18c4...,Malicious,2024-05-01T19:00:00Z
OTX,domain,shady-site.biz,Suspicious,2024-05-01T19:02:00Z
AbuseIPDB,ip,185.130.5.231,Malicious,2024-05-01T19:01:00Z

Markdown Report
# Threat Intelligence Report - Phishing Kit

## Indicators of Compromise

### Domains
| Domain             | Source     | Threat Level | First Seen  |
|--------------------|------------|--------------|-------------|
| shady-site.biz     | VirusTotal | Malicious    | 2024-05-01  |

---

## 🔍 How This Works (Plain English)

This tool automates the process of checking Indicators of Compromise (IOCs) against multiple threat intelligence sources. Here's how it works step-by-step:

### Step 1: Parse IOC Input
You provide one or more IOCs via command-line arguments:
- `--hash` - File hash (MD5, SHA1, or SHA256)
- `--ip` - IP address to check
- `--domain` - Domain name to check
- `--threat-type` - Category label (required: "Emotet", "CISA Alert", or "Phishing Kit")
- `--output` - Format for results (csv, json, or report)

**Example:**
```bash
python scripts/main.py --ip 185.130.5.231 --threat-type "Phishing Kit" --output json
```

### Step 2: Call Threat Intelligence APIs
The tool makes authenticated API calls to three services:

**VirusTotal API:**
- Checks file hashes, IPs, and domains
- Returns: Detection count (how many engines flagged it), threat level, tags, first seen date
- Uses API endpoint: `https://www.virustotal.com/api/v3`

**AbuseIPDB API:**
- Checks IP addresses for abuse reports
- Returns: Confidence score (0-100), total abuse reports, ISP, country
- Uses API endpoint: `https://api.abuseipdb.com/api/v2/check`

**AlienVault OTX API:**
- Checks IPs and domains for threat intelligence
- Returns: Pulse count (threat intelligence reports), references, tags
- Uses API endpoint: `https://otx.alienvault.com/api/v1`

### Step 3: Normalize Results
The tool combines data from all sources and standardizes the format:
- Source (which API provided the data)
- IOC Type (hash, ip, or domain)
- IOC Value (the actual hash/IP/domain)
- Threat Level (Malicious, Suspicious, or Clean)
- First Seen timestamp
- Additional metadata (detection counts, confidence scores, etc.)

### Step 4: Export Report
Results are saved in your chosen format:

**CSV Format:**
- Tabular data, easy to import into Excel or databases
- Appends to existing file if it exists
- Saved to `data/threat_intel_iocs.csv`

**JSON Format:**
- Structured data, easy to parse programmatically
- Appends to existing file if it exists
- Saved to `data/threat_intel_iocs.json`

**Markdown Report:**
- Human-readable report with tables and analysis
- Includes threat-specific recommendations
- Saved to `reports/threat_intel_report.md`

### What APIs It Calls
- **VirusTotal:** `/files/{hash}`, `/ip_addresses/{ip}`, `/domains/{domain}`
- **AbuseIPDB:** `/api/v2/check` (IP addresses only)
- **AlienVault OTX:** `/indicators/IPv4/{ip}/general`, `/indicators/domain/{domain}/general`

### What Inputs It Expects
- **Hash:** MD5, SHA1, or SHA256 hash (64 characters for SHA256)
- **IP:** Valid IPv4 address (e.g., `185.130.5.231`)
- **Domain:** Valid domain name (e.g., `example.com`)
- **Threat Type:** One of: "Emotet", "CISA Alert", "Phishing Kit"
- **Output Format:** One of: "csv", "json", "report"

### What Output It Produces
- **CSV:** Tabular data with columns: Source, IOC Type, IOC Value, Threat Label, First Seen
- **JSON:** Structured data with nested objects containing all metadata
- **Markdown:** Formatted report with tables, analysis, and recommendations

### How to Troubleshoot
1. **API Key Issues:** Check `.env` file exists and contains valid API keys
2. **Network Errors:** Verify internet connection and API endpoint availability
3. **Rate Limiting:** APIs have rate limits; wait between calls if needed
4. **Invalid IOC Format:** Verify hash/IP/domain format is correct
5. **File Permissions:** Ensure write access for `data/`, `logs/`, `reports/` directories
6. **Missing Dependencies:** Run `pip install -r requirements.txt`

### Example Troubleshooting
```bash
# Check if API keys are loaded
python -c "from dotenv import load_dotenv; import os; load_dotenv(); print(os.getenv('VIRUSTOTAL_API_KEY'))"

# Test with a known good IP (Google DNS)
python scripts/main.py --ip 8.8.8.8 --threat-type "Phishing Kit" --output json

# Check logs for errors
cat logs/threat_intel.log
```

---

🧠 What You'll Learn
- How to collect and structure IOC data
- Real-world threat intel automation
- How to make authenticated API requests in Python
- Basic reporting for SOC or SOAR integration

✅ License
MIT License

---

## ✅ Verified Run (Live API Test)

**Date:** 2026-02-04  
**Environment:** Kali Linux / Ubuntu (Python venv)  
**APIs Verified:** VirusTotal, AbuseIPDB, AlienVault OTX

### Commands Used

```bash
# Test IP lookup
python scripts/main.py --ip 8.8.8.8 --threat-type "CISA Alert" --output report

# Test hash lookup
python scripts/main.py --hash 44d88612fea8a8f36de82e1278abb02f --threat-type "Emotet" --output report
```

### Output

- ✅ Report generated successfully: `reports/threat_intel_report_[timestamp].md`
- ✅ Logging enabled: `logs/threat_intel.log`
- ✅ All three APIs responded successfully
- ✅ Data normalized and exported correctly

### Notes

- Created missing output folders (`reports/`, `data/`) automatically during verification
- Tool successfully enriches IOCs and generates timestamped Markdown reports
- Reports are now saved with unique timestamps to prevent overwriting
- All API integrations verified working

### Verification Status

**Status:** ✅ Verified and Working  
**Bucket Classification:** Bucket A (You Did It)  
**Interview Ready:** Yes - Can explain and demonstrate

---

👤 Author
Developed by Grey Key Studios