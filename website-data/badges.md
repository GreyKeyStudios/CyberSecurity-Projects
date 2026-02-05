# Badge System for Website

## Badge Types

### ✅ Verified Complete
- **Color:** Green
- **Use For:** Projects that are fully complete with evidence
- **Criteria:**
  - Project is fully implemented
  - Evidence exists (screenshots, files, documentation)
  - Can be explained in detail
  - Ready for interview discussion

**Projects:**
- SOC Casefiles
- Log Analysis (Splunk)
- Wireshark Packet Capture
- Firewall Setup

---

### 🧪 Verified (API Tool Tested)
- **Color:** Blue
- **Use For:** Tools/scripts that have been tested with live APIs
- **Criteria:**
  - Code is complete and functional
  - Tested with real API calls
  - Sample output exists
  - Can be demonstrated

**Projects:**
- Threat Intelligence Tool

---

### 📋 Planned / Scaffold
- **Color:** Gray
- **Use For:** Projects with structure but not yet implemented
- **Criteria:**
  - Project structure exists
  - Files are placeholders
  - Clearly marked as planned
  - Not ready for interview discussion

**Projects:**
- IDS Setup
- Malware Analysis
- Home Security Lab
- Docker Security Lab

---

## Badge Display Guidelines

### On Project Cards:
- Display badge prominently (top-right corner)
- Use appropriate color coding
- Include tooltip/description on hover

### On Project Detail Pages:
- Display badge at top of page
- Include badge description
- Show status clearly

### On Portfolio Overview:
- Group projects by badge type
- Show statistics (X verified, Y planned)
- Make it clear what's ready vs. planned

---

## Badge Implementation Notes

### CSS Classes:
```css
.badge-verified-complete { color: green; }
.badge-verified-api { color: blue; }
.badge-scaffold { color: gray; }
```

### React Component Example:
```jsx
<Badge type="verified-complete" label="✅ Verified Complete" />
```

### Accessibility:
- Include aria-label with full description
- Use semantic HTML
- Ensure color contrast meets WCAG standards

---

## Why This Matters

**Honesty:** Shows you're transparent about what's complete vs. planned  
**Professionalism:** Demonstrates project management and organization  
**Confidence:** Recruiters know exactly what you can discuss  
**Trust:** No risk of "pretending to do work" - everything is clearly marked

---

**Last Updated:** 2026-02-04
