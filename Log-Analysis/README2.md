# Log Analysis - Splunk Syslog Dashboard

This project is part of a cybersecurity portfolio demonstrating centralized log collection and analysis using Splunk. The focus is on monitoring system logs (syslog and auth.log) from a Kali Linux VM and visualizing key security events.

## 🎯 Objective

- Monitor and visualize live system events from Kali Linux using Splunk.
- Detect failed login attempts and executed sudo commands.
- Create interactive dashboards for real-time analysis.
- Simulate Security Operations Center (SOC) functionality.

## 🔧 Tools Used

- Kali Linux
- Splunk Enterprise (Free Trial)
- rsyslog
- Log files: `/var/log/syslog`, `/var/log/auth.log`

## 📊 Dashboard Panels

| Panel Title            | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| Syslog Event Trends    | Line chart displaying frequency of syslog events over time.                 |
| Live System Events     | Real-time table showing recent syslog entries.                              |
| Failed Login Attempts  | Count of failed SSH login attempts based on auth.log analysis.              |
| Sudo Commands Executed | Displays which users ran sudo commands and what commands were executed.     |

## 🔍 Search Queries Used

### Syslog Event Trends
```spl
index=* sourcetype=syslog
| timechart count by host

###Live System Events
index=* sourcetype=syslog
| table _time, host, sourcetype, message

###Failed Login Attempts
index=* source="/var/log/auth.log" ("Failed password" OR "authentication failure")
| stats count by user, host, _time

###Sudo Commands Executed
index=* source="/var/log/auth.log" "sudo:"
| rex "COMMAND=(?<command>.+)"
| stats count by user, command

🧠 Lessons Learned
Identifying the correct sourcetype (e.g., auth-too_small) was essential to get the expected results.

Ensuring log files were being monitored by Splunk required editing the data input sources.

Log entries like sudo usage sometimes require rex extraction due to format differences.

Splunk health warnings (e.g., disk space) can interfere with ingestion—resolved by cleaning and restarting the instance.

⏭️ Next Steps
Set alerts for brute-force detection and privilege escalation.

Expand monitoring to include firewall and application logs.

Create a blog to document project walkthroughs and challenges.

This project is part of a personal cybersecurity lab and is for educational use.