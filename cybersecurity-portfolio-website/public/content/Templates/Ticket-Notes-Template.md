# Ticket Notes Template

Use this template for documenting incidents in ticketing systems (Jira, ServiceNow, etc.).

## Format 1: Concise (for ticketing systems)

```
INCIDENT: [ID]
STATUS: [Open/In Progress/Resolved/Closed]
SEVERITY: [Low/Medium/High/Critical]

SUMMARY:
[One sentence description of the incident]

INVESTIGATION:
[Key investigation steps and findings - bullet points]

IOCs:
- IP: [IP Address]
- Domain: [Domain]
- Hash: [File Hash]
- Email: [Email Address]

ACTIONS:
- [Action 1]
- [Action 2]
- [Action 3]

RESOLUTION:
[Brief resolution summary]
```

## Format 2: Detailed (for documentation)

### Alert Information
- **Alert ID:** [ID]
- **Alert Type:** [Type]
- **Severity:** [Level]
- **Source:** [System]
- **Time:** [Timestamp]

### Triage
- **Initial Assessment:** [Assessment]
- **Priority:** [Priority Level]
- **Assigned To:** [Analyst]

### Investigation
**Step 1: [Action]**
- Tool: [Tool]
- Finding: [Finding]

**Step 2: [Action]**
- Tool: [Tool]
- Finding: [Finding]

### Findings
- **Verdict:** [Verdict]
- **IOCs:** [List]
- **Impact:** [Impact Description]

### Resolution
- **Actions Taken:** [List]
- **Status:** [Status]
- **Follow-up:** [Follow-up Actions]

---

## Quick Reference: Common Ticket Fields

| Field | Description | Example |
|-------|-------------|---------|
| **Title** | Brief incident description | "Phishing Email - Suspicious Attachment" |
| **Severity** | Impact level | High |
| **Status** | Current state | In Progress |
| **Category** | Incident type | Phishing |
| **Source** | Detection system | Email Security Gateway |
| **Assigned** | Analyst name | John Doe |
| **IOCs** | Indicators found | IP, Domain, Hash |
| **Resolution** | How it was resolved | Email quarantined, IP blocked |

---

## Tips for Writing Ticket Notes

1. **Be Concise:** Ticketing systems have character limits
2. **Use Bullets:** Easier to scan than paragraphs
3. **Include IOCs:** Always list indicators found
4. **Document Actions:** List what was done, not just findings
5. **Update Status:** Keep status current as you work
6. **Add Timestamps:** Note when actions were taken
7. **Link Related:** Reference related tickets/incidents
