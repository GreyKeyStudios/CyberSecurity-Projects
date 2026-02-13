#!/usr/bin/env python3
"""
IOC Enrichment Script
Enriches IOCs (IPs, domains, hashes) with threat intelligence from multiple sources.

Requirements:
    pip install requests python-dotenv

API Keys needed (get free keys from respective platforms):
    - VirusTotal: https://www.virustotal.com/gui/join-us
    - AbuseIPDB: https://www.abuseipdb.com/register
    - AlienVault OTX: https://otx.alienvault.com/
"""

import requests
import json
import os
import time
from typing import Dict, List, Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# API Configuration
VIRUSTOTAL_API_KEY = os.getenv("VIRUSTOTAL_API_KEY")
ABUSEIPDB_API_KEY = os.getenv("ABUSEIPDB_API_KEY")
OTX_API_KEY = os.getenv("OTX_API_KEY")


class IOCEnricher:
    """Enrich IOCs with threat intelligence from multiple sources."""
    
    def __init__(self):
        self.vt_api_key = VIRUSTOTAL_API_KEY
        self.abuseipdb_api_key = ABUSEIPDB_API_KEY
        self.otx_api_key = OTX_API_KEY
        
    def check_virustotal_ip(self, ip: str) -> Dict:
        """
        Check IP reputation on VirusTotal.
        
        Args:
            ip: IP address to check
            
        Returns:
            Dictionary with VirusTotal results
        """
        if not self.vt_api_key:
            return {"error": "VirusTotal API key not configured"}
        
        url = f"https://www.virustotal.com/api/v3/ip_addresses/{ip}"
        headers = {"x-apikey": self.vt_api_key}
        
        try:
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            # Extract relevant information
            stats = data.get("data", {}).get("attributes", {}).get("last_analysis_stats", {})
            
            return {
                "source": "VirusTotal",
                "malicious": stats.get("malicious", 0),
                "suspicious": stats.get("suspicious", 0),
                "harmless": stats.get("harmless", 0),
                "undetected": stats.get("undetected", 0),
                "reputation": data.get("data", {}).get("attributes", {}).get("reputation", 0),
                "url": f"https://www.virustotal.com/gui/ip-address/{ip}"
            }
        except requests.exceptions.RequestException as e:
            return {"error": f"VirusTotal API error: {str(e)}"}
    
    def check_abuseipdb(self, ip: str) -> Dict:
        """
        Check IP reputation on AbuseIPDB.
        
        Args:
            ip: IP address to check
            
        Returns:
            Dictionary with AbuseIPDB results
        """
        if not self.abuseipdb_api_key:
            return {"error": "AbuseIPDB API key not configured"}
        
        url = "https://api.abuseipdb.com/api/v2/check"
        headers = {
            "Key": self.abuseipdb_api_key,
            "Accept": "application/json"
        }
        params = {"ipAddress": ip, "maxAgeInDays": 90}
        
        try:
            response = requests.get(url, headers=headers, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            result = data.get("data", {})
            
            return {
                "source": "AbuseIPDB",
                "abuse_confidence_score": result.get("abuseConfidenceScore", 0),
                "total_reports": result.get("totalReports", 0),
                "country": result.get("countryCode", "Unknown"),
                "isp": result.get("isp", "Unknown"),
                "is_public": result.get("isPublic", False),
                "is_whitelisted": result.get("isWhitelisted", False),
                "url": f"https://www.abuseipdb.com/check/{ip}"
            }
        except requests.exceptions.RequestException as e:
            return {"error": f"AbuseIPDB API error: {str(e)}"}
    
    def check_otx_ip(self, ip: str) -> Dict:
        """
        Check IP reputation on AlienVault OTX.
        
        Args:
            ip: IP address to check
            
        Returns:
            Dictionary with OTX results
        """
        if not self.otx_api_key:
            return {"error": "OTX API key not configured"}
        
        url = f"https://otx.alienvault.com/api/v1/indicators/IPv4/{ip}/general"
        headers = {"X-OTX-API-KEY": self.otx_api_key}
        
        try:
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            return {
                "source": "AlienVault OTX",
                "pulse_count": data.get("pulse_info", {}).get("count", 0),
                "country": data.get("country_name", "Unknown"),
                "asn": data.get("asn", "Unknown"),
                "url": f"https://otx.alienvault.com/indicator/ip/{ip}"
            }
        except requests.exceptions.RequestException as e:
            return {"error": f"OTX API error: {str(e)}"}
    
    def check_virustotal_hash(self, file_hash: str) -> Dict:
        """
        Check file hash on VirusTotal.
        
        Args:
            file_hash: MD5, SHA1, or SHA256 hash
            
        Returns:
            Dictionary with VirusTotal results
        """
        if not self.vt_api_key:
            return {"error": "VirusTotal API key not configured"}
        
        url = f"https://www.virustotal.com/api/v3/files/{file_hash}"
        headers = {"x-apikey": self.vt_api_key}
        
        try:
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            attributes = data.get("data", {}).get("attributes", {})
            stats = attributes.get("last_analysis_stats", {})
            
            return {
                "source": "VirusTotal",
                "malicious": stats.get("malicious", 0),
                "suspicious": stats.get("suspicious", 0),
                "harmless": stats.get("harmless", 0),
                "undetected": stats.get("undetected", 0),
                "file_type": attributes.get("type_description", "Unknown"),
                "file_size": attributes.get("size", 0),
                "first_seen": attributes.get("first_submission_date", "Unknown"),
                "url": f"https://www.virustotal.com/gui/file/{file_hash}"
            }
        except requests.exceptions.RequestException as e:
            if response.status_code == 404:
                return {"error": "Hash not found in VirusTotal database"}
            return {"error": f"VirusTotal API error: {str(e)}"}
    
    def enrich_ip(self, ip: str) -> Dict:
        """
        Enrich IP address with data from multiple sources.
        
        Args:
            ip: IP address to enrich
            
        Returns:
            Dictionary with enrichment results from all sources
        """
        print(f"\n[+] Enriching IP: {ip}")
        
        results = {
            "ioc": ip,
            "ioc_type": "ip",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "sources": {}
        }
        
        # Check VirusTotal
        print("  [*] Checking VirusTotal...")
        vt_result = self.check_virustotal_ip(ip)
        results["sources"]["virustotal"] = vt_result
        time.sleep(15)  # Rate limiting for free API (4 requests/minute)
        
        # Check AbuseIPDB
        print("  [*] Checking AbuseIPDB...")
        abuseipdb_result = self.check_abuseipdb(ip)
        results["sources"]["abuseipdb"] = abuseipdb_result
        time.sleep(1)
        
        # Check OTX
        print("  [*] Checking AlienVault OTX...")
        otx_result = self.check_otx_ip(ip)
        results["sources"]["otx"] = otx_result
        
        # Generate verdict
        results["verdict"] = self._generate_verdict_ip(results["sources"])
        
        return results
    
    def enrich_hash(self, file_hash: str) -> Dict:
        """
        Enrich file hash with data from VirusTotal.
        
        Args:
            file_hash: File hash (MD5, SHA1, or SHA256)
            
        Returns:
            Dictionary with enrichment results
        """
        print(f"\n[+] Enriching Hash: {file_hash}")
        
        results = {
            "ioc": file_hash,
            "ioc_type": "hash",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "sources": {}
        }
        
        # Check VirusTotal
        print("  [*] Checking VirusTotal...")
        vt_result = self.check_virustotal_hash(file_hash)
        results["sources"]["virustotal"] = vt_result
        
        # Generate verdict
        results["verdict"] = self._generate_verdict_hash(results["sources"])
        
        return results
    
    def _generate_verdict_ip(self, sources: Dict) -> str:
        """Generate overall verdict for IP based on all sources."""
        vt = sources.get("virustotal", {})
        abuseipdb = sources.get("abuseipdb", {})
        otx = sources.get("otx", {})
        
        # Check for errors
        if all("error" in source for source in [vt, abuseipdb, otx]):
            return "UNKNOWN - All API queries failed"
        
        # Determine verdict
        vt_malicious = vt.get("malicious", 0)
        abuse_score = abuseipdb.get("abuse_confidence_score", 0)
        otx_pulses = otx.get("pulse_count", 0)
        
        if vt_malicious > 5 or abuse_score > 75 or otx_pulses > 10:
            return "MALICIOUS - High confidence"
        elif vt_malicious > 0 or abuse_score > 25 or otx_pulses > 3:
            return "SUSPICIOUS - Further investigation recommended"
        else:
            return "CLEAN - No significant threats detected"
    
    def _generate_verdict_hash(self, sources: Dict) -> str:
        """Generate overall verdict for hash based on VirusTotal."""
        vt = sources.get("virustotal", {})
        
        if "error" in vt:
            return f"UNKNOWN - {vt['error']}"
        
        malicious = vt.get("malicious", 0)
        
        if malicious > 5:
            return "MALICIOUS - High confidence"
        elif malicious > 0:
            return "SUSPICIOUS - Some engines detected threats"
        else:
            return "CLEAN - No threats detected"


def print_results(results: Dict):
    """Pretty print enrichment results."""
    print("\n" + "=" * 80)
    print(f"IOC ENRICHMENT RESULTS")
    print("=" * 80)
    print(f"IOC: {results['ioc']}")
    print(f"Type: {results['ioc_type'].upper()}")
    print(f"Timestamp: {results['timestamp']}")
    print(f"\nVERDICT: {results['verdict']}")
    print("\n" + "-" * 80)
    print("THREAT INTELLIGENCE SOURCES:")
    print("-" * 80)
    
    for source_name, source_data in results['sources'].items():
        print(f"\n{source_data.get('source', source_name.upper())}:")
        if "error" in source_data:
            print(f"  ❌ {source_data['error']}")
        else:
            for key, value in source_data.items():
                if key not in ['source', 'url']:
                    print(f"  • {key}: {value}")
            if 'url' in source_data:
                print(f"  🔗 {source_data['url']}")
    
    print("\n" + "=" * 80 + "\n")


def main():
    """Main function."""
    print("""
╔═══════════════════════════════════════════════════════════════════════╗
║                        IOC ENRICHMENT TOOL                            ║
║                   Enrich IPs and Hashes with TI                       ║
╚═══════════════════════════════════════════════════════════════════════╝
    """)
    
    # Check for API keys
    if not all([VIRUSTOTAL_API_KEY, ABUSEIPDB_API_KEY, OTX_API_KEY]):
        print("⚠️  Warning: Some API keys are not configured.")
        print("   Create a .env file with:")
        print("   VIRUSTOTAL_API_KEY=your_key_here")
        print("   ABUSEIPDB_API_KEY=your_key_here")
        print("   OTX_API_KEY=your_key_here\n")
    
    enricher = IOCEnricher()
    
    # Example IOCs
    iocs = [
        ("ip", "8.8.8.8"),  # Google DNS (clean example)
        # ("hash", "44d88612fea8a8f36de82e1278abb02f"),  # Uncomment to test hash
    ]
    
    # Process each IOC
    all_results = []
    for ioc_type, ioc_value in iocs:
        if ioc_type == "ip":
            results = enricher.enrich_ip(ioc_value)
        elif ioc_type == "hash":
            results = enricher.enrich_hash(ioc_value)
        else:
            print(f"[!] Unknown IOC type: {ioc_type}")
            continue
        
        print_results(results)
        all_results.append(results)
    
    # Optionally save to JSON file
    output_file = "ioc_enrichment_results.json"
    with open(output_file, 'w') as f:
        json.dump(all_results, f, indent=2)
    print(f"[+] Results saved to: {output_file}")


if __name__ == "__main__":
    main()
