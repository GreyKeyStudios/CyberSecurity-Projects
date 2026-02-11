#!/usr/bin/env python3
"""
Regex IOC Extractors
Regular expressions for extracting common IOCs (Indicators of Compromise) from text.

Useful for:
- Parsing logs
- Extracting IOCs from emails
- Analyzing incident reports
- Processing threat intelligence feeds
"""

import re
from typing import List, Set, Dict
from dataclasses import dataclass


@dataclass
class IOCExtraction:
    """Container for extracted IOCs."""
    ips: Set[str]
    domains: Set[str]
    urls: Set[str]
    emails: Set[str]
    md5_hashes: Set[str]
    sha1_hashes: Set[str]
    sha256_hashes: Set[str]
    file_paths: Set[str]
    
    def __str__(self):
        """Pretty print extraction results."""
        output = ["=" * 80, "IOC EXTRACTION RESULTS", "=" * 80]
        
        if self.ips:
            output.append(f"\nIP Addresses ({len(self.ips)}):")
            for ip in sorted(self.ips):
                output.append(f"  • {ip}")
        
        if self.domains:
            output.append(f"\nDomains ({len(self.domains)}):")
            for domain in sorted(self.domains):
                output.append(f"  • {domain}")
        
        if self.urls:
            output.append(f"\nURLs ({len(self.urls)}):")
            for url in sorted(self.urls):
                output.append(f"  • {url}")
        
        if self.emails:
            output.append(f"\nEmail Addresses ({len(self.emails)}):")
            for email in sorted(self.emails):
                output.append(f"  • {email}")
        
        if self.md5_hashes:
            output.append(f"\nMD5 Hashes ({len(self.md5_hashes)}):")
            for h in sorted(self.md5_hashes):
                output.append(f"  • {h}")
        
        if self.sha1_hashes:
            output.append(f"\nSHA1 Hashes ({len(self.sha1_hashes)}):")
            for h in sorted(self.sha1_hashes):
                output.append(f"  • {h}")
        
        if self.sha256_hashes:
            output.append(f"\nSHA256 Hashes ({len(self.sha256_hashes)}):")
            for h in sorted(self.sha256_hashes):
                output.append(f"  • {h}")
        
        if self.file_paths:
            output.append(f"\nFile Paths ({len(self.file_paths)}):")
            for path in sorted(self.file_paths):
                output.append(f"  • {path}")
        
        output.append("=" * 80)
        return "\n".join(output)


class IOCExtractor:
    """Extract various IOC types from text using regex patterns."""
    
    # IP Address patterns
    IPV4_PATTERN = re.compile(
        r'\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}'
        r'(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b'
    )
    
    IPV6_PATTERN = re.compile(
        r'\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b|'
        r'\b::(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}\b|'
        r'\b[0-9a-fA-F]{1,4}::(?:[0-9a-fA-F]{1,4}:){0,5}[0-9a-fA-F]{1,4}\b'
    )
    
    # Domain pattern (more strict to avoid false positives)
    DOMAIN_PATTERN = re.compile(
        r'\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}\b'
    )
    
    # URL pattern
    URL_PATTERN = re.compile(
        r'https?://[^\s<>"{}|\\^`\[\]]+'
    )
    
    # Email pattern
    EMAIL_PATTERN = re.compile(
        r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    )
    
    # Hash patterns
    MD5_PATTERN = re.compile(r'\b[a-fA-F0-9]{32}\b')
    SHA1_PATTERN = re.compile(r'\b[a-fA-F0-9]{40}\b')
    SHA256_PATTERN = re.compile(r'\b[a-fA-F0-9]{64}\b')
    
    # File paths
    WINDOWS_PATH_PATTERN = re.compile(
        r'[A-Za-z]:\\(?:[^\s\\/:*?"<>|\r\n]+\\)*[^\s\\/:*?"<>|\r\n]*'
    )
    UNIX_PATH_PATTERN = re.compile(
        r'/(?:[^/\s]+/)*[^/\s]*'
    )
    
    # Registry keys
    REGISTRY_PATTERN = re.compile(
        r'(?:HKEY_LOCAL_MACHINE|HKLM|HKEY_CURRENT_USER|HKCU|HKEY_CLASSES_ROOT|HKCR|'
        r'HKEY_USERS|HKU|HKEY_CURRENT_CONFIG|HKCC)\\[^\s]+'
    )
    
    # CVE identifiers
    CVE_PATTERN = re.compile(r'CVE-\d{4}-\d{4,7}', re.IGNORECASE)
    
    # Bitcoin addresses
    BTC_PATTERN = re.compile(r'\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b')
    
    # Private IP ranges (for filtering)
    PRIVATE_IP_RANGES = [
        r'^10\.',
        r'^172\.(?:1[6-9]|2[0-9]|3[01])\.',
        r'^192\.168\.',
        r'^127\.',
        r'^169\.254\.',
    ]
    
    @classmethod
    def extract_ips(cls, text: str, include_private: bool = True) -> Set[str]:
        """
        Extract IP addresses from text.
        
        Args:
            text: Input text
            include_private: Include private IP ranges
            
        Returns:
            Set of IP addresses
        """
        ipv4_matches = cls.IPV4_PATTERN.findall(text)
        ipv6_matches = cls.IPV6_PATTERN.findall(text)
        
        all_ips = set(ipv4_matches + ipv6_matches)
        
        if not include_private:
            # Filter out private IPs
            all_ips = {
                ip for ip in all_ips
                if not any(re.match(pattern, ip) for pattern in cls.PRIVATE_IP_RANGES)
            }
        
        return all_ips
    
    @classmethod
    def extract_domains(cls, text: str, exclude_common: bool = True) -> Set[str]:
        """
        Extract domain names from text.
        
        Args:
            text: Input text
            exclude_common: Exclude common domains (microsoft.com, google.com, etc.)
            
        Returns:
            Set of domain names
        """
        # Common domains to exclude (reduce false positives)
        common_domains = {
            'microsoft.com', 'windows.com', 'google.com', 'apple.com',
            'mozilla.org', 'github.com', 'stackoverflow.com', 'example.com',
            'localhost.com', 'w3.org', 'schema.org'
        }
        
        matches = cls.DOMAIN_PATTERN.findall(text)
        domains = set(matches)
        
        if exclude_common:
            domains = {d for d in domains if d.lower() not in common_domains}
        
        return domains
    
    @classmethod
    def extract_urls(cls, text: str) -> Set[str]:
        """Extract URLs from text."""
        return set(cls.URL_PATTERN.findall(text))
    
    @classmethod
    def extract_emails(cls, text: str) -> Set[str]:
        """Extract email addresses from text."""
        return set(cls.EMAIL_PATTERN.findall(text))
    
    @classmethod
    def extract_hashes(cls, text: str) -> Dict[str, Set[str]]:
        """
        Extract file hashes from text.
        
        Returns:
            Dictionary with keys 'md5', 'sha1', 'sha256'
        """
        return {
            'md5': set(cls.MD5_PATTERN.findall(text)),
            'sha1': set(cls.SHA1_PATTERN.findall(text)),
            'sha256': set(cls.SHA256_PATTERN.findall(text))
        }
    
    @classmethod
    def extract_file_paths(cls, text: str) -> Set[str]:
        """Extract Windows and Unix file paths."""
        windows_paths = set(cls.WINDOWS_PATH_PATTERN.findall(text))
        unix_paths = set(cls.UNIX_PATH_PATTERN.findall(text))
        
        # Filter out common false positives for Unix paths
        unix_paths = {
            p for p in unix_paths
            if len(p) > 3 and '/' in p[1:]  # Must have at least one subdirectory
        }
        
        return windows_paths | unix_paths
    
    @classmethod
    def extract_registry_keys(cls, text: str) -> Set[str]:
        """Extract Windows registry keys."""
        return set(cls.REGISTRY_PATTERN.findall(text))
    
    @classmethod
    def extract_cves(cls, text: str) -> Set[str]:
        """Extract CVE identifiers."""
        return set(cls.CVE_PATTERN.findall(text))
    
    @classmethod
    def extract_btc_addresses(cls, text: str) -> Set[str]:
        """Extract Bitcoin wallet addresses."""
        return set(cls.BTC_PATTERN.findall(text))
    
    @classmethod
    def extract_all(cls, text: str) -> IOCExtraction:
        """
        Extract all IOC types from text.
        
        Args:
            text: Input text
            
        Returns:
            IOCExtraction object with all extracted IOCs
        """
        hashes = cls.extract_hashes(text)
        
        return IOCExtraction(
            ips=cls.extract_ips(text, include_private=False),
            domains=cls.extract_domains(text),
            urls=cls.extract_urls(text),
            emails=cls.extract_emails(text),
            md5_hashes=hashes['md5'],
            sha1_hashes=hashes['sha1'],
            sha256_hashes=hashes['sha256'],
            file_paths=cls.extract_file_paths(text)
        )


def defang_ioc(ioc: str) -> str:
    """
    Defang an IOC to prevent accidental clicks/execution.
    
    Examples:
        evil.com -> evil[.]com
        http://bad.com -> hxxp://bad[.]com
        192.168.1.1 -> 192[.]168[.]1[.]1
    """
    defanged = ioc.replace('http://', 'hxxp://')
    defanged = defanged.replace('https://', 'hxxps://')
    defanged = defanged.replace('.', '[.]')
    defanged = defanged.replace('@', '[@]')
    return defanged


def refang_ioc(ioc: str) -> str:
    """
    Refang an IOC back to original format.
    
    Examples:
        evil[.]com -> evil.com
        hxxp://bad[.]com -> http://bad.com
    """
    refanged = ioc.replace('hxxp://', 'http://')
    refanged = refanged.replace('hxxps://', 'https://')
    refanged = refanged.replace('[.]', '.')
    refanged = refanged.replace('[@]', '@')
    return refanged


# Example usage
def demo():
    """Demonstrate IOC extraction."""
    
    sample_text = """
    Incident Report: Phishing Campaign
    
    On 2024-01-15, we detected a phishing campaign targeting our users.
    
    Malicious indicators:
    - IP addresses: 203.0.113.42, 198.51.100.50, 192.0.2.1
    - Domains: evil-phishing-site.com, malware-dropper.net
    - URLs: http://evil-phishing-site.com/login.php, https://malware-dropper.net/payload.exe
    - Email sender: attacker@malicious-domain.com
    - File hash (SHA256): abc123def4567890abcdef1234567890abcdef1234567890abcdef1234567890
    - File hash (MD5): 5d41402abc4b2a76b9719d911017c592
    - Malicious file: C:\\Users\\victim\\AppData\\Local\\Temp\\malware.exe
    - Registry persistence: HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\Malware
    - Related CVE: CVE-2024-1234
    - Ransom wallet: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
    
    The campaign was blocked and all affected systems were cleaned.
    """
    
    print("=" * 80)
    print("SAMPLE TEXT:")
    print("=" * 80)
    print(sample_text)
    print()
    
    # Extract all IOCs
    extraction = IOCExtractor.extract_all(sample_text)
    print(extraction)
    
    # Demonstrate defanging
    print("\n" + "=" * 80)
    print("DEFANGED IOCs (safe for documentation):")
    print("=" * 80)
    if extraction.domains:
        print("\nDefanged domains:")
        for domain in sorted(extraction.domains):
            print(f"  {domain} -> {defang_ioc(domain)}")
    
    if extraction.urls:
        print("\nDefanged URLs:")
        for url in sorted(extraction.urls):
            print(f"  {url}")
            print(f"  -> {defang_ioc(url)}")
    
    # Additional extractions
    print("\n" + "=" * 80)
    print("ADDITIONAL IOC TYPES:")
    print("=" * 80)
    
    registry_keys = IOCExtractor.extract_registry_keys(sample_text)
    if registry_keys:
        print(f"\nRegistry Keys ({len(registry_keys)}):")
        for key in sorted(registry_keys):
            print(f"  • {key}")
    
    cves = IOCExtractor.extract_cves(sample_text)
    if cves:
        print(f"\nCVEs ({len(cves)}):")
        for cve in sorted(cves):
            print(f"  • {cve}")
    
    btc = IOCExtractor.extract_btc_addresses(sample_text)
    if btc:
        print(f"\nBitcoin Addresses ({len(btc)}):")
        for addr in sorted(btc):
            print(f"  • {addr}")


def extract_from_file(filepath: str):
    """Extract IOCs from a file."""
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    
    extraction = IOCExtractor.extract_all(text)
    print(extraction)
    
    return extraction


if __name__ == "__main__":
    print("""
╔═══════════════════════════════════════════════════════════════════════╗
║                      REGEX IOC EXTRACTOR                              ║
║         Extract indicators of compromise from any text                ║
╚═══════════════════════════════════════════════════════════════════════╝
    """)
    
    demo()
    
    print("\n" + "=" * 80)
    print("USAGE EXAMPLES:")
    print("=" * 80)
    print("""
# Extract from string
text = "Malicious IP: 203.0.113.42 contacted evil.com"
iocs = IOCExtractor.extract_all(text)
print(iocs)

# Extract specific type
ips = IOCExtractor.extract_ips(text, include_private=False)
domains = IOCExtractor.extract_domains(text)
hashes = IOCExtractor.extract_hashes(text)

# Extract from file
extraction = extract_from_file("incident_report.txt")

# Defang IOCs for safe documentation
defanged = defang_ioc("http://evil.com")
print(defanged)  # hxxp://evil[.]com

# Refang IOCs for analysis
refanged = refang_ioc("hxxp://evil[.]com")
print(refanged)  # http://evil.com
    """)
