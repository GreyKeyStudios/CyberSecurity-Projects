import os

# Define the base project path
base_path = r"C:\Users\Student\Desktop\CyberSecurity-Projects\Docker-Security-Lab"

# Define the required directories inside the project
directories = [
    "frontend",
    "backend",
    "configs",
    "logs",
    "scripts",
    "dockerfiles",
    "data",
    "reports"
]

# Define the required files (empty for now)
files = [
    "README.md",
    "docker-compose.yml",
    
    # Backend-related files
    "backend/app.py",
    "backend/requirements.txt",
    "backend/Dockerfile",
    
    # Frontend-related files
    "frontend/index.html",
    "frontend/styles.css",
    "frontend/script.js",
    "frontend/Dockerfile",

    # Config and security-related files
    "configs/nginx.conf",
    "configs/firewall.rules",
    
    # Shell scripts for setup/cleanup
    "scripts/setup.sh",
    "scripts/cleanup.sh",
    
    # Placeholder for logs and reports
    "logs/.gitkeep",  # Ensures logs folder exists even if empty
    "reports/security_report.txt"
]

# Create directories if they don't exist
for directory in directories:
    dir_path = os.path.join(base_path, directory)
    os.makedirs(dir_path, exist_ok=True)

# Create empty files if they don’t exist
for file in files:
    file_path = os.path.join(base_path, file)
    if not os.path.exists(file_path):
        with open(file_path, "w") as f:
            pass  # Creates an empty file

print("✅ Project structure has been fully set up!")
