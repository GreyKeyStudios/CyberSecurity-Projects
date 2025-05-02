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

🧠 What You’ll Learn
How to collect and structure IOC data

Real-world threat intel automation

How to make authenticated API requests in Python

Basic reporting for SOC or SOAR integration

✅ License
MIT License

👤 Author
Developed by Grey Key Studios