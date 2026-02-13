# User Activity Investigation Template

Use this template when investigating a user’s activity (insider risk, compromised account, or policy violation).

## Case Metadata

- **Case ID:** [ID]
- **Subject:** [User/account name or identifier]
- **Date Opened:** [Date]
- **Investigator:** [Name]
- **Reason for investigation:** [Alert type / HR request / incident spillover]

---

## Executive Summary

[2–3 sentences: who, what was reviewed, conclusion (policy violation / benign / compromised / inconclusive), and recommended action.]

---

## Subject Information

- **User/Account:** [Identifier]
- **Department/Role:** [Role]
- **Manager:** [Name]
- **Account status:** [Active/Locked/Offboarded]
- **Relevant systems:** [Email, VPN, file share, etc.]

---

## Timeline of Events

| Date/Time (UTC) | Event / Action | Source | Notes |
|-----------------|----------------|--------|--------|
| [DateTime] | [Action] | [Log/EDR/Email] | [Note] |
| [DateTime] | [Action] | [Source] | [Note] |

---

## Data Sources Reviewed

- **Authentication logs:** [Systems reviewed, date range]
- **Email:** [Client/scope]
- **Endpoint (EDR):** [Host, time range]
- **Network/proxy:** [Scope]
- **File access / DLP:** [Scope]
- **Other:** [List]

---

## Key Findings

### Logins / Access
- **Unusual logins:** [Time, location, device]
- **Failed attempts:** [Count, pattern]
- **Privilege use:** [sudo, admin, etc.]

### Data Access / Exfiltration
- **Files accessed:** [Sensitive shares, key files]
- **Downloads/upload:** [Volume, destination]
- **External sharing:** [If applicable]

### Communications
- **Email patterns:** [Recipients, volume, content flags]
- **IM/Collab:** [If reviewed]

### Policy / Behavior
- **Policy violations:** [What was violated]
- **Concerning behavior:** [Summary]

---

## Evidence Summary

- **Screenshots/artifacts:** [List or attach]
- **Key log excerpts:** [Reference or paste]
- **Preserved evidence:** [Where stored, chain of custody note]

---

## Conclusion

- **Verdict:** [Policy violation / Benign / Compromised account / Inconclusive / Other]
- **Confidence:** [High/Medium/Low]
- **Rationale:** [Short explanation]

---

## Recommended Actions

- **Immediate:** [Disable account, reset password, notify manager, etc.]
- **Follow-up:** [HR, legal, threat hunt, user training]
- **Documentation:** [Ticket updates, handoff]

---

## Sign-off

- **Investigator:** [Name]
- **Date:** [Date]
- **Reviewed by:** [Name if required]
