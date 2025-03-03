import os

# Base project path
base_path = r"C:\Users\Student\Desktop\CyberSecurity-Projects"

# Define project folders (excluding Docker-Security-Lab, which is already set up)
projects = [
    "Firewall-Setup",
    "Home-Security-Lab",
    "IDS_Setup",
    "Log-Analysis",
    "Malware-Analysis",
    "Threat-Intelligence",
    "Wireshark-Packet-Capture"
]

# Define common subdirectories for each project
subdirectories = [
    "configs",
    "scripts",
    "logs",
    "data",
    "reports"
]

# Define common files for each project
common_files = [
    "README.md",
    "notes.txt"
]

# Define specific files for each project
project_specific_files = {
    "Firewall-Setup": ["configs/firewall.rules", "scripts/firewall_setup.sh"],
    "Home-Security-Lab": ["configs/home_security.conf", "scripts/setup_intrusion_detection.sh"],
    "IDS_Setup": ["configs/ids.conf", "scripts/install_snort.sh"],
    "Log-Analysis": ["configs/logging.conf", "scripts/analyze_logs.py"],
    "Malware-Analysis": ["configs/malware_scan.conf", "scripts/malware_scan.py"],
    "Threat-Intelligence": ["configs/threat_sources.conf", "scripts/threat_analysis.py"],
    "Wireshark-Packet-Capture": ["configs/wireshark.conf", "scripts/capture_traffic.sh"],
}

# Iterate through each project and create necessary directories/files
for project in projects:
    project_path = os.path.join(base_path, project)

    # Create subdirectories
    for subdir in subdirectories:
        os.makedirs(os.path.join(project_path, subdir), exist_ok=True)

    # Create common files
    for file in common_files:
        file_path = os.path.join(project_path, file)
        if not os.path.exists(file_path):
            with open(file_path, "w") as f:
                f.write(f"# {project} Documentation\n")

    # Create project-specific files
    for file in project_specific_files.get(project, []):
        file_path = os.path.join(project_path, file)
        if not os.path.exists(file_path):
            with open(file_path, "w") as f:
                pass  # Create empty files

print("✅ All cybersecurity project directories and files have been created!")
