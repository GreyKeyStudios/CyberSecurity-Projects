import os
import json
import pandas as pd
from datetime import datetime
import argparse
from typing import Dict, List, Optional
from utils import get_virustotal_data, get_abuseipdb_data, get_otx_data
from dotenv import load_dotenv
import logging
from reporting import generate_markdown_report

# Set up logging
os.makedirs('logs', exist_ok=True)
logging.basicConfig(
    filename='logs/threat_intel.log',
    level=logging.INFO,
    format='%(asctime)s %(levelname)s: %(message)s'
)

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
            logging.warning("No IOCs to save to CSV.")
            return
        try:
            filepath = os.path.join("data", filename)
            df = pd.DataFrame(self.iocs)
            if os.path.exists(filepath):
                existing_df = pd.read_csv(filepath)
                combined_df = pd.concat([existing_df, df]).drop_duplicates(subset=['ioc_value', 'source'], keep='last')
                combined_df.to_csv(filepath, index=False)
                print(f"Appended to existing {filename}")
                logging.info(f"Appended to existing {filename}")
            else:
                df.to_csv(filepath, index=False)
                print(f"Created new {filename}")
                logging.info(f"Created new {filename}")
        except Exception as e:
            print(f"Error saving to CSV: {e}")
            logging.error(f"Error saving to CSV: {e}")

    def save_to_json(self, filename: str = "threat_intel_iocs.json"):
        """Save collected IOCs to JSON file, appending to existing file if it exists"""
        if not self.iocs:
            print("No IOCs to save")
            logging.warning("No IOCs to save to JSON.")
            return
        try:
            filepath = os.path.join("data", filename)
            if os.path.exists(filepath):
                with open(filepath, 'r') as f:
                    existing_data = json.load(f)
                combined_data = existing_data + self.iocs
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
                logging.info(f"Appended to existing {filename}")
            else:
                with open(filepath, 'w') as f:
                    json.dump(self.iocs, f, indent=4)
                print(f"Created new {filename}")
                logging.info(f"Created new {filename}")
        except Exception as e:
            print(f"Error saving to JSON: {e}")
            logging.error(f"Error saving to JSON: {e}")

    def generate_report(self, filename: str = "threat_intel_report.md"):
        """Generate a markdown report of findings"""
        generate_markdown_report(self.iocs, self.threat_type, filename)

def main():
    try:
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
    except Exception as e:
        print(f"Fatal error: {e}")
        logging.critical(f"Fatal error: {e}")

if __name__ == "__main__":
    main() 