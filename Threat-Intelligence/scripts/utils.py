import os
import requests
from typing import Dict, Optional
from datetime import datetime

def get_virustotal_data(api_key: str, query: str, query_type: str) -> Optional[Dict]:
    """Helper function to fetch data from VirusTotal API"""
    base_url = "https://www.virustotal.com/api/v3"
    headers = {
        "x-apikey": api_key,
        "Accept": "application/json"
    }
    
    try:
        if query_type == "hash":
            response = requests.get(f"{base_url}/files/{query}", headers=headers)
        elif query_type == "ip":
            response = requests.get(f"{base_url}/ip_addresses/{query}", headers=headers)
        elif query_type == "domain":
            response = requests.get(f"{base_url}/domains/{query}", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            attributes = data.get("data", {}).get("attributes", {})
            stats = attributes.get("last_analysis_stats", {})
            
            # Determine threat level
            if stats.get("malicious", 0) > 0:
                threat_level = "Malicious"
            elif stats.get("suspicious", 0) > 0:
                threat_level = "Suspicious"
            else:
                threat_level = "Clean"
            
            # Get additional metadata
            metadata = {
                "source": "VirusTotal",
                "ioc_type": query_type,
                "ioc_value": query,
                "threat_label": threat_level,
                "first_seen": datetime.now().strftime("%Y-%m-%d %H:%M:%SZ"),
                "detection_count": stats.get("malicious", 0),
                "total_engines": sum(stats.values()),
                "popular_threat_category": attributes.get("popular_threat_category", []),
                "tags": attributes.get("tags", [])
            }
            
            # Add game-related tags if present
            game_related_tags = [tag for tag in metadata["tags"] if any(game_term in tag.lower() for game_term in ["game", "gaming", "cheat", "crack", "mod"])]
            if game_related_tags:
                metadata["game_related"] = True
                metadata["game_tags"] = game_related_tags
            else:
                metadata["game_related"] = False
            
            return metadata
    except Exception as e:
        print(f"Error in VirusTotal API call: {e}")
    return None

def get_abuseipdb_data(api_key: str, ip: str) -> Optional[Dict]:
    """Helper function to fetch data from AbuseIPDB API"""
    url = "https://api.abuseipdb.com/api/v2/check"
    headers = {
        "Key": api_key,
        "Accept": "application/json"
    }
    params = {
        "ipAddress": ip,
        "maxAgeInDays": "90"
    }
    
    try:
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()
            abuse_data = data.get("data", {})
            
            # Determine threat level
            confidence_score = abuse_data.get("abuseConfidenceScore", 0)
            if confidence_score > 75:
                threat_level = "Malicious"
            elif confidence_score > 25:
                threat_level = "Suspicious"
            else:
                threat_level = "Clean"
            
            metadata = {
                "source": "AbuseIPDB",
                "ioc_type": "ip",
                "ioc_value": ip,
                "threat_label": threat_level,
                "first_seen": datetime.now().strftime("%Y-%m-%d %H:%M:%SZ"),
                "confidence_score": confidence_score,
                "total_reports": abuse_data.get("totalReports", 0),
                "last_reported": abuse_data.get("lastReportedAt", ""),
                "isp": abuse_data.get("isp", ""),
                "country": abuse_data.get("countryCode", "")
            }
            
            # Check if IP is associated with gaming or game-related services
            isp_lower = metadata["isp"].lower()
            if any(game_term in isp_lower for game_term in ["game", "gaming", "server", "hosting"]):
                metadata["game_related"] = True
            else:
                metadata["game_related"] = False
            
            return metadata
    except Exception as e:
        print(f"Error in AbuseIPDB API call: {e}")
    return None

def get_otx_data(api_key: str, query: str, query_type: str) -> Optional[Dict]:
    """Helper function to fetch data from AlienVault OTX API"""
    base_url = "https://otx.alienvault.com/api/v1"
    headers = {
        "X-OTX-API-KEY": api_key
    }
    
    try:
        if query_type == "ip":
            response = requests.get(f"{base_url}/indicators/IPv4/{query}/general", headers=headers)
        elif query_type == "domain":
            response = requests.get(f"{base_url}/indicators/domain/{query}/general", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            pulse_info = data.get("pulse_info", {})
            
            # Determine threat level
            if pulse_info.get("count", 0) > 0:
                threat_level = "Malicious"
            else:
                threat_level = "Clean"
            
            metadata = {
                "source": "OTX",
                "ioc_type": query_type,
                "ioc_value": query,
                "threat_label": threat_level,
                "first_seen": datetime.now().strftime("%Y-%m-%d %H:%M:%SZ"),
                "pulse_count": pulse_info.get("count", 0),
                "references": pulse_info.get("references", []),
                "tags": pulse_info.get("tags", [])
            }
            
            # Check for game-related indicators
            game_related_tags = [tag for tag in metadata["tags"] if any(game_term in tag.lower() for game_term in ["game", "gaming", "cheat", "crack", "mod"])]
            if game_related_tags:
                metadata["game_related"] = True
                metadata["game_tags"] = game_related_tags
            else:
                metadata["game_related"] = False
            
            return metadata
    except Exception as e:
        print(f"Error in OTX API call: {e}")
    return None 