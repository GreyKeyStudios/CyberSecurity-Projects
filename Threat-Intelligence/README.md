# 🛰️ Automated Threat Intelligence Lab

## Summary

This project pulls and logs live threat data using public APIs from VirusTotal, AlienVault OTX, and AbuseIPDB. The tool aggregates indicators of compromise (IOCs) like malicious hashes, IPs, and domains into structured formats such as CSV or JSON.

> 📌 This project was designed to demonstrate scripting, threat intel workflows, and API integration.

## ⚙️ Features

- Fetch IOCs from multiple sources:
  - VirusTotal (hashes, IPs, domains)
  - AbuseIPDB (IP reputation)
  - AlienVault OTX (IPs, domains)
- Normalize and store results in CSV or JSON format
- Easy setup with environment variables for API keys
- CLI flags for specific queries

## 🧰 Tools Used

- Python 3.x
- VirusTotal API
- AlienVault OTX API
- AbuseIPDB API
- pandas for data handling
- python-dotenv for configuration

## 🔐 Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Threat-Intelligence.git
   cd Threat-Intelligence
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the root directory with your API keys:
   ```
   VIRUSTOTAL_API_KEY=your_virustotal_api_key_here
   ABUSEIPDB_API_KEY=your_abuseipdb_api_key_here
   OTX_API_KEY=your_otx_api_key_here
   ```

4. Run the script:
   ```bash
   python scripts/main.py --hash <hash_value> --ip <ip_address> --domain <domain_name> --output <csv|json>
   ```

## 🧪 Sample Usage

Check a specific hash:
```bash
python scripts/main.py --hash e99a18c428cb38d5f260853678922e03
```

Check an IP address:
```bash
python scripts/main.py --ip 45.76.23.19
```

Check a domain:
```bash
python scripts/main.py --domain shady-site.biz
```

Save output as JSON:
```bash
python scripts/main.py --hash e99a18c428cb38d5f260853678922e03 --output json
```

## 📊 Sample Output

CSV format:
```
Source,IOC Type,IOC Value,Threat Label,First Seen
VirusTotal,hash,e99a18c428cb38d5f260853678922e03,Malicious,2024-03-03 19:00:00Z
AbuseIPDB,ip,45.76.23.19,Malicious,2024-03-03 19:01:00Z
OTX,domain,shady-site.biz,Malicious,2024-03-03 19:02:00Z
```

## 🧠 What You Learn

- Working with real-world threat data
- Making authenticated API requests in Python
- Structuring IOC data for use in SIEM or SOAR platforms
- Building a basic threat intel aggregator

## 📝 License

MIT License

## 👤 Author

Built by [Your Name]
