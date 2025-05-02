import os
import json
import pandas as pd
from datetime import datetime
import argparse
from typing import Dict, List, Optional
from utils import get_virustotal_data, get_abuseipdb_data, get_otx_data
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class ThreatIntelligence:
    def __init__(self):
        self.iocs = []
        self.threat_type = None
        
    def fetch_virustotal_data(self, query: str, query_type: str) -> Optional[Dict]:
        """Fetch data from VirusTotal API"""
        api_key = os.getenv("VIRUSTOTAL_API_KEY")
        if not api_key:
            print("VirusTotal API key not found in environment variables")
            return None
        return get_virustotal_data(api_key, query, query_type)

    def fetch_abuseipdb_data(self, ip: str) -> Optional[Dict]:
        """Fetch data from AbuseIPDB API"""
        api_key = os.getenv("ABUSEIPDB_API_KEY")
        if not api_key:
            print("AbuseIPDB API key not found in environment variables")
            return None
        return get_abuseipdb_data(api_key, ip)

    def fetch_otx_data(self, query: str, query_type: str) -> Optional[Dict]:
        """Fetch data from AlienVault OTX API"""
        api_key = os.getenv("OTX_API_KEY")
        if not api_key:
            print("OTX API key not found in environment variables")
            return None
        return get_otx_data(api_key, query, query_type)

    def save_to_csv(self, filename: str = "threat_intel_iocs.csv"):
        """Save collected IOCs to CSV file, appending to existing file if it exists"""
        if not self.iocs:
            print("No IOCs to save")
            return
        
        filepath = os.path.join("data", filename)
        df = pd.DataFrame(self.iocs)
        
        # If file exists, append to it
        if os.path.exists(filepath):
            existing_df = pd.read_csv(filepath)
            # Remove duplicates based on ioc_value and source
            combined_df = pd.concat([existing_df, df]).drop_duplicates(subset=['ioc_value', 'source'], keep='last')
            combined_df.to_csv(filepath, index=False)
            print(f"Appended to existing {filename}")
        else:
            df.to_csv(filepath, index=False)
            print(f"Created new {filename}")

    def save_to_json(self, filename: str = "threat_intel_iocs.json"):
        """Save collected IOCs to JSON file, appending to existing file if it exists"""
        if not self.iocs:
            print("No IOCs to save")
            return
        
        filepath = os.path.join("data", filename)
        
        # If file exists, append to it
        if os.path.exists(filepath):
            with open(filepath, 'r') as f:
                existing_data = json.load(f)
            
            # Combine existing and new data, removing duplicates
            combined_data = existing_data + self.iocs
            # Remove duplicates based on ioc_value and source
            seen = set()
            unique_data = []
            for item in combined_data:
                key = (item['ioc_value'], item['source'])
                if key not in seen:
                    seen.add(key)
                    unique_data.append(item)
            
            with open(filepath, 'w') as f:
                json.dump(unique_data, f, indent=4)
            print(f"Appended to existing {filename}")
        else:
            with open(filepath, 'w') as f:
                json.dump(self.iocs, f, indent=4)
            print(f"Created new {filename}")

    def generate_report(self, filename: str = "threat_intel_report.md"):
        """Generate a markdown report of findings"""
        if not self.iocs:
            print("No IOCs to generate report from")
            return

        # Read existing report if it exists
        filepath = os.path.join("reports", filename)
        if os.path.exists(filepath):
            with open(filepath, 'r') as f:
                existing_report = f.read()
        else:
            existing_report = ""

        report = [
            f"# Threat Intelligence Report - {self.threat_type}",
            f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            "\n## Overview",
            f"This report details indicators of compromise (IOCs) related to {self.threat_type}.",
            "\n## Indicators of Compromise",
            "\n### IP Addresses",
            "| IP Address | Source | Threat Level | First Seen |",
            "|------------|--------|--------------|------------|"
        ]

        # Add IP data
        for ioc in self.iocs:
            if ioc["ioc_type"] == "ip":
                report.append(f"| {ioc['ioc_value']} | {ioc['source']} | {ioc['threat_label']} | {ioc['first_seen']} |")

        report.extend([
            "\n### Domains",
            "| Domain | Source | Threat Level | First Seen |",
            "|--------|--------|--------------|------------|"
        ])

        # Add domain data
        for ioc in self.iocs:
            if ioc["ioc_type"] == "domain":
                report.append(f"| {ioc['ioc_value']} | {ioc['source']} | {ioc['threat_label']} | {ioc['first_seen']} |")

        report.extend([
            "\n### File Hashes",
            "| Hash | Source | Threat Level | First Seen |",
            "|------|--------|--------------|------------|"
        ])

        # Add hash data
        for ioc in self.iocs:
            if ioc["ioc_type"] == "hash":
                report.append(f"| {ioc['ioc_value']} | {ioc['source']} | {ioc['threat_label']} | {ioc['first_seen']} |")

        # Add threat-specific analysis
        if self.threat_type == "Emotet":
            report.extend([
                "\n## Analysis",
                "### Emotet Characteristics",
                "- Banking Trojan and botnet",
                "- Spreads through malicious email attachments",
                "- Uses modular architecture for flexibility",
                "- Often distributed through spam campaigns",
                "\n### Recommendations",
                "- Implement email filtering and scanning",
                "- Keep systems and software updated",
                "- Use endpoint protection solutions",
                "- Train users on email security best practices"
            ])
        elif self.threat_type == "CISA Alert":
            report.extend([
                "\n## Analysis",
                "### CISA Alert Characteristics",
                "- Government-issued security advisories",
                "- Focus on critical infrastructure threats",
                "- Often includes mitigation strategies",
                "- Targets specific vulnerabilities or attack patterns",
                "\n### Recommendations",
                "- Review and implement CISA recommendations",
                "- Monitor for updates to alerts",
                "- Share information with relevant stakeholders",
                "- Implement suggested mitigations"
            ])
        elif self.threat_type == "Phishing Kit":
            report.extend([
                "\n## Analysis",
                "### Phishing Kit Characteristics",
                "- Pre-packaged tools for creating phishing sites",
                "- Often include templates and automation",
                "- Target various services (email, banking, etc.)",
                "- May include credential harvesting capabilities",
                "\n### Recommendations",
                "- Implement email authentication (SPF, DKIM, DMARC)",
                "- Use web filtering solutions",
                "- Train users on phishing awareness",
                "- Monitor for suspicious domain registrations"
            ])

        report.extend([
            "\n## References",
            "- VirusTotal: https://www.virustotal.com",
            "- AbuseIPDB: https://www.abuseipdb.com",
            "- AlienVault OTX: https://otx.alienvault.com",
            "- CISA: https://www.cisa.gov"
        ])

        # Append new report to existing one
        with open(filepath, 'w') as f:
            if existing_report:
                f.write(existing_report + "\n\n---\n\n")
            f.write('\n'.join(report))
        print(f"Report saved to {filename}")

def main():
    parser = argparse.ArgumentParser(description="Threat Intelligence Gathering Tool")
    parser.add_argument("--hash", help="Search for a specific hash")
    parser.add_argument("--ip", help="Search for a specific IP address")
    parser.add_argument("--domain", help="Search for a specific domain")
    parser.add_argument("--threat-type", choices=["Emotet", "CISA Alert", "Phishing Kit"], required=True, help="Type of threat to investigate")
    parser.add_argument("--output", choices=["csv", "json", "report"], default="report", help="Output format")
    
    args = parser.parse_args()
    
    ti = ThreatIntelligence()
    ti.threat_type = args.threat_type
    
    # Process queries based on provided arguments
    if args.hash:
        result = ti.fetch_virustotal_data(args.hash, "hash")
        if result:
            ti.iocs.append(result)
    
    if args.ip:
        # Check IP against all three services
        result = ti.fetch_virustotal_data(args.ip, "ip")
        if result:
            ti.iocs.append(result)
            
        result = ti.fetch_abuseipdb_data(args.ip)
        if result:
            ti.iocs.append(result)
            
        result = ti.fetch_otx_data(args.ip, "ip")
        if result:
            ti.iocs.append(result)
    
    if args.domain:
        # Check domain against VirusTotal and OTX
        result = ti.fetch_virustotal_data(args.domain, "domain")
        if result:
            ti.iocs.append(result)
            
        result = ti.fetch_otx_data(args.domain, "domain")
        if result:
            ti.iocs.append(result)
    
    # Save results
    if args.output == "csv":
        ti.save_to_csv()
    elif args.output == "json":
        ti.save_to_json()
    else:
        ti.generate_report()

if __name__ == "__main__":
    main() 