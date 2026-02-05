import os
from datetime import datetime
import logging

def generate_markdown_report(iocs, threat_type, filename=None):
    """Generate a markdown report of findings and save to file."""
    if not iocs:
        print("No IOCs to generate report from")
        logging.warning("No IOCs to generate report from.")
        return
    try:
        # Create reports directory if it doesn't exist
        os.makedirs("reports", exist_ok=True)
        
        # Generate timestamped filename if not provided
        if filename is None:
            timestamp = datetime.now().strftime("%Y-%m-%d_%H%M%S")
            filename = f"threat_intel_report_{timestamp}.md"
        
        filepath = os.path.join("reports", filename)
        if os.path.exists(filepath):
            with open(filepath, 'r') as f:
                existing_report = f.read()
        else:
            existing_report = ""
        report = [
            f"# Threat Intelligence Report - {threat_type}",
            f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            "\n## Overview",
            f"This report details indicators of compromise (IOCs) related to {threat_type}.",
            "\n## Indicators of Compromise",
            "\n### IP Addresses",
            "| IP Address | Source | Threat Level | First Seen |",
            "|------------|--------|--------------|------------|"
        ]
        for ioc in iocs:
            if ioc["ioc_type"] == "ip":
                report.append(f"| {ioc['ioc_value']} | {ioc['source']} | {ioc['threat_label']} | {ioc['first_seen']} |")
        report.extend([
            "\n### Domains",
            "| Domain | Source | Threat Level | First Seen |",
            "|--------|--------|--------------|------------|"
        ])
        for ioc in iocs:
            if ioc["ioc_type"] == "domain":
                report.append(f"| {ioc['ioc_value']} | {ioc['source']} | {ioc['threat_label']} | {ioc['first_seen']} |")
        report.extend([
            "\n### File Hashes",
            "| Hash | Source | Threat Level | First Seen |",
            "|------|--------|--------------|------------|"
        ])
        for ioc in iocs:
            if ioc["ioc_type"] == "hash":
                report.append(f"| {ioc['ioc_value']} | {ioc['source']} | {ioc['threat_label']} | {ioc['first_seen']} |")
        # Add threat-specific analysis
        if threat_type == "Emotet":
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
        elif threat_type == "CISA Alert":
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
        elif threat_type == "Phishing Kit":
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
        with open(filepath, 'w') as f:
            if existing_report:
                f.write(existing_report + "\n\n---\n\n")
            f.write('\n'.join(report))
        print(f"Report saved to {filename}")
        logging.info(f"Report saved to {filename}")
    except Exception as e:
        print(f"Error generating report: {e}")
        logging.error(f"Error generating report: {e}") 