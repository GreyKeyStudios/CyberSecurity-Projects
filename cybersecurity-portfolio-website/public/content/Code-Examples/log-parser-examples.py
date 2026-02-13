#!/usr/bin/env python3
"""
Log Parser Examples
Demonstrates parsing common log formats used in SOC analysis.

Covers:
- Syslog format
- Windows Event Logs (exported to CSV/XML)
- Apache/Nginx access logs
- JSON-formatted logs
- Custom log formats with regex
"""

import re
import json
import csv
from datetime import datetime
from typing import Dict, List, Optional
import xml.etree.ElementTree as ET


class SyslogParser:
    """Parse standard syslog format logs."""
    
    # RFC 3164 Syslog format regex
    SYSLOG_PATTERN = re.compile(
        r'^(?P<timestamp>\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})\s+'
        r'(?P<hostname>\S+)\s+'
        r'(?P<process>\S+?)(\[(?P<pid>\d+)\])?:\s+'
        r'(?P<message>.*)$'
    )
    
    @classmethod
    def parse_line(cls, line: str) -> Optional[Dict]:
        """
        Parse a single syslog line.
        
        Args:
            line: Raw syslog line
            
        Returns:
            Dictionary with parsed fields or None if parsing fails
        """
        match = cls.SYSLOG_PATTERN.match(line.strip())
        if not match:
            return None
        
        return {
            'timestamp': match.group('timestamp'),
            'hostname': match.group('hostname'),
            'process': match.group('process'),
            'pid': match.group('pid'),
            'message': match.group('message')
        }
    
    @classmethod
    def parse_file(cls, filepath: str) -> List[Dict]:
        """Parse entire syslog file."""
        results = []
        with open(filepath, 'r') as f:
            for line in f:
                parsed = cls.parse_line(line)
                if parsed:
                    results.append(parsed)
        return results


class WindowsEventLogParser:
    """Parse Windows Event Logs exported to CSV format."""
    
    @staticmethod
    def parse_csv(filepath: str) -> List[Dict]:
        """
        Parse Windows Event Log CSV export.
        
        Args:
            filepath: Path to CSV file
            
        Returns:
            List of dictionaries with event data
        """
        events = []
        with open(filepath, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for row in reader:
                events.append({
                    'event_id': row.get('Event ID', ''),
                    'timestamp': row.get('Date and Time', ''),
                    'source': row.get('Source', ''),
                    'level': row.get('Level', ''),
                    'user': row.get('User', ''),
                    'computer': row.get('Computer', ''),
                    'message': row.get('Message', '')
                })
        return events
    
    @staticmethod
    def filter_by_event_id(events: List[Dict], event_ids: List[str]) -> List[Dict]:
        """Filter events by Event ID."""
        return [e for e in events if e['event_id'] in event_ids]
    
    @staticmethod
    def find_failed_logins(events: List[Dict]) -> List[Dict]:
        """Extract failed login attempts (Event ID 4625)."""
        return WindowsEventLogParser.filter_by_event_id(events, ['4625'])
    
    @staticmethod
    def find_successful_logins(events: List[Dict]) -> List[Dict]:
        """Extract successful logins (Event ID 4624)."""
        return WindowsEventLogParser.filter_by_event_id(events, ['4624'])


class ApacheLogParser:
    """Parse Apache/Nginx access logs."""
    
    # Common Log Format (CLF)
    CLF_PATTERN = re.compile(
        r'^(?P<ip>\S+)\s+'
        r'(?P<ident>\S+)\s+'
        r'(?P<user>\S+)\s+'
        r'\[(?P<timestamp>[^\]]+)\]\s+'
        r'"(?P<request>[^"]*)"\s+'
        r'(?P<status>\d+)\s+'
        r'(?P<size>\S+)'
    )
    
    # Combined Log Format (includes referrer and user agent)
    COMBINED_PATTERN = re.compile(
        r'^(?P<ip>\S+)\s+'
        r'(?P<ident>\S+)\s+'
        r'(?P<user>\S+)\s+'
        r'\[(?P<timestamp>[^\]]+)\]\s+'
        r'"(?P<request>[^"]*)"\s+'
        r'(?P<status>\d+)\s+'
        r'(?P<size>\S+)\s+'
        r'"(?P<referrer>[^"]*)"\s+'
        r'"(?P<user_agent>[^"]*)"'
    )
    
    @classmethod
    def parse_line(cls, line: str, format_type: str = "combined") -> Optional[Dict]:
        """
        Parse Apache/Nginx log line.
        
        Args:
            line: Raw log line
            format_type: "clf" or "combined"
            
        Returns:
            Dictionary with parsed fields
        """
        pattern = cls.COMBINED_PATTERN if format_type == "combined" else cls.CLF_PATTERN
        match = pattern.match(line.strip())
        
        if not match:
            return None
        
        result = match.groupdict()
        
        # Parse request into method, path, protocol
        request = result.get('request', '')
        request_parts = request.split(' ')
        if len(request_parts) >= 3:
            result['method'] = request_parts[0]
            result['path'] = request_parts[1]
            result['protocol'] = request_parts[2]
        
        return result
    
    @classmethod
    def find_status_code(cls, filepath: str, status_code: str) -> List[Dict]:
        """Find all requests with specific status code."""
        results = []
        with open(filepath, 'r') as f:
            for line in f:
                parsed = cls.parse_line(line)
                if parsed and parsed.get('status') == status_code:
                    results.append(parsed)
        return results
    
    @classmethod
    def find_suspicious_paths(cls, filepath: str) -> List[Dict]:
        """Find potentially malicious request paths."""
        suspicious_patterns = [
            r'\.\./',  # Directory traversal
            r'<script',  # XSS attempts
            r'union.*select',  # SQL injection
            r'exec\(',  # Command injection
            r'\.php\?',  # PHP injection attempts
            r'cmd\.exe',  # Windows command execution
            r'/etc/passwd',  # Unix file access
        ]
        
        results = []
        with open(filepath, 'r') as f:
            for line in f:
                parsed = cls.parse_line(line)
                if not parsed:
                    continue
                
                path = parsed.get('path', '').lower()
                for pattern in suspicious_patterns:
                    if re.search(pattern, path, re.IGNORECASE):
                        parsed['suspicious_pattern'] = pattern
                        results.append(parsed)
                        break
        
        return results


class JSONLogParser:
    """Parse JSON-formatted logs (common in modern applications)."""
    
    @staticmethod
    def parse_line(line: str) -> Optional[Dict]:
        """Parse single JSON log line."""
        try:
            return json.loads(line.strip())
        except json.JSONDecodeError:
            return None
    
    @staticmethod
    def parse_file(filepath: str) -> List[Dict]:
        """Parse file with one JSON object per line."""
        results = []
        with open(filepath, 'r') as f:
            for line in f:
                parsed = JSONLogParser.parse_line(line)
                if parsed:
                    results.append(parsed)
        return results
    
    @staticmethod
    def filter_by_level(logs: List[Dict], level: str) -> List[Dict]:
        """Filter logs by severity level."""
        return [log for log in logs if log.get('level', '').lower() == level.lower()]
    
    @staticmethod
    def search_message(logs: List[Dict], pattern: str) -> List[Dict]:
        """Search for pattern in log messages."""
        regex = re.compile(pattern, re.IGNORECASE)
        return [log for log in logs if regex.search(log.get('message', ''))]


class CustomLogParser:
    """Parse custom log formats using regex."""
    
    @staticmethod
    def create_parser(pattern: str, field_names: List[str]):
        """
        Create a custom parser for any log format.
        
        Args:
            pattern: Regex pattern with named groups
            field_names: List of field names matching the groups
            
        Returns:
            Function that parses log lines
        """
        compiled_pattern = re.compile(pattern)
        
        def parser(line: str) -> Optional[Dict]:
            match = compiled_pattern.match(line.strip())
            if not match:
                return None
            return match.groupdict()
        
        return parser


# Example usage and demonstrations
def demo_syslog_parsing():
    """Demonstrate syslog parsing."""
    print("\n" + "="*80)
    print("SYSLOG PARSING DEMO")
    print("="*80)
    
    sample_logs = [
        "Jan 15 10:23:45 server01 sshd[12345]: Failed password for invalid user admin from 192.168.1.100 port 22 ssh2",
        "Jan 15 10:24:01 server01 sshd[12346]: Accepted publickey for john from 10.0.0.50 port 45678 ssh2",
        "Jan 15 10:25:15 firewall01 kernel: [UFW BLOCK] IN=eth0 OUT= SRC=203.0.113.42 DST=192.168.1.1 PROTO=TCP DPT=3389"
    ]
    
    for log in sample_logs:
        parsed = SyslogParser.parse_line(log)
        if parsed:
            print(f"\nOriginal: {log}")
            print(f"Parsed:")
            for key, value in parsed.items():
                print(f"  {key}: {value}")


def demo_apache_log_parsing():
    """Demonstrate Apache log parsing."""
    print("\n" + "="*80)
    print("APACHE LOG PARSING DEMO")
    print("="*80)
    
    sample_logs = [
        '192.168.1.100 - - [15/Jan/2024:10:23:45 +0000] "GET /index.html HTTP/1.1" 200 1234 "-" "Mozilla/5.0"',
        '203.0.113.42 - - [15/Jan/2024:10:24:01 +0000] "GET /../../../etc/passwd HTTP/1.1" 404 0 "-" "curl/7.68.0"',
        '10.0.0.50 - john [15/Jan/2024:10:25:15 +0000] "POST /api/login HTTP/1.1" 200 567 "https://example.com" "Chrome"'
    ]
    
    for log in sample_logs:
        parsed = ApacheLogParser.parse_line(log)
        if parsed:
            print(f"\nOriginal: {log}")
            print(f"IP: {parsed['ip']}")
            print(f"Method: {parsed.get('method', 'N/A')}")
            print(f"Path: {parsed.get('path', 'N/A')}")
            print(f"Status: {parsed['status']}")


def demo_json_log_parsing():
    """Demonstrate JSON log parsing."""
    print("\n" + "="*80)
    print("JSON LOG PARSING DEMO")
    print("="*80)
    
    sample_logs = [
        '{"timestamp": "2024-01-15T10:23:45Z", "level": "ERROR", "message": "Database connection failed", "source": "api.py"}',
        '{"timestamp": "2024-01-15T10:24:01Z", "level": "INFO", "message": "User login successful", "user": "john", "ip": "10.0.0.50"}',
        '{"timestamp": "2024-01-15T10:25:15Z", "level": "WARNING", "message": "Multiple failed login attempts detected", "ip": "203.0.113.42"}'
    ]
    
    logs = [JSONLogParser.parse_line(log) for log in sample_logs]
    logs = [log for log in logs if log]  # Remove None values
    
    print("\nAll logs:")
    for log in logs:
        print(f"  [{log['level']}] {log['timestamp']}: {log['message']}")
    
    print("\nError logs only:")
    errors = JSONLogParser.filter_by_level(logs, "ERROR")
    for log in errors:
        print(f"  {log['timestamp']}: {log['message']}")


def demo_ioc_extraction():
    """Demonstrate extracting IOCs from logs."""
    print("\n" + "="*80)
    print("IOC EXTRACTION DEMO")
    print("="*80)
    
    # Regular expressions for common IOCs
    ip_pattern = r'\b(?:\d{1,3}\.){3}\d{1,3}\b'
    domain_pattern = r'\b(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\b'
    md5_pattern = r'\b[a-fA-F0-9]{32}\b'
    sha256_pattern = r'\b[a-fA-F0-9]{64}\b'
    
    sample_log = """
    2024-01-15 10:23:45 Detected connection to malicious-domain.com (203.0.113.42)
    File hash: abc123def456789012345678901234567890123456789012345678901234
    Additional C2: evil-server.net (198.51.100.50)
    """
    
    print("Sample log:")
    print(sample_log)
    
    print("\nExtracted IOCs:")
    
    # Extract IPs
    ips = re.findall(ip_pattern, sample_log)
    print(f"\nIP Addresses: {ips}")
    
    # Extract domains
    domains = re.findall(domain_pattern, sample_log)
    print(f"Domains: {domains}")
    
    # Extract hashes
    sha256_hashes = re.findall(sha256_pattern, sample_log)
    print(f"SHA256 Hashes: {sha256_hashes}")


def main():
    """Run all demonstrations."""
    print("""
╔═══════════════════════════════════════════════════════════════════════╗
║                       LOG PARSER EXAMPLES                             ║
║            Common log parsing techniques for SOC analysis             ║
╚═══════════════════════════════════════════════════════════════════════╝
    """)
    
    demo_syslog_parsing()
    demo_apache_log_parsing()
    demo_json_log_parsing()
    demo_ioc_extraction()
    
    print("\n" + "="*80)
    print("COMPLETE")
    print("="*80)
    print("\nThese parsers can be adapted for your specific log formats.")
    print("Combine with pandas for advanced analysis and filtering.")


if __name__ == "__main__":
    main()
