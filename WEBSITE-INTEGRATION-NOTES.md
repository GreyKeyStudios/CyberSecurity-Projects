# Website Integration Notes

## Overview
This document provides guidance for integrating the Next.js website with the portfolio repository.

---

## Project Data Structure

All project metadata is available in `website-data/projects.json`:

### Key Fields:
- `id` - Unique identifier
- `title` - Project name
- `badge` - Badge type (verified-complete, verified-api, scaffold)
- `badgeLabel` - Display label for badge
- `status` - complete or planned
- `featured` - Should appear on homepage
- `githubPath` - Path to project in GitHub repo
- `evidence` - Array of evidence items
- `skills` - Array of skills demonstrated
- `tools` - Array of tools used

---

## Badge System

### Badge Types:
1. **✅ Verified Complete** (green)
   - Fully complete projects with evidence
   - Can be explained in interviews

2. **🧪 Verified (API Tool Tested)** (blue)
   - Tools tested with live APIs
   - Sample output available

3. **📋 Planned / Scaffold** (gray)
   - Structure exists, implementation pending
   - Clearly marked as planned

### Implementation:
- Use badge colors for visual distinction
- Include badge on project cards
- Show badge on project detail pages
- Group projects by badge type in overview

---

## Featured Projects

These 3 projects should be highlighted on the homepage:

1. **SOC Casefiles** - Most relevant for SOC roles
2. **Log Analysis (Splunk)** - Demonstrates SIEM skills
3. **Threat Intelligence Tool** - Shows automation capabilities

---

## GitHub Integration

### Project Links:
- All projects link to GitHub paths: `https://github.com/[username]/CyberSecurity-Projects/tree/main/[githubPath]`
- README files are in each project directory
- Screenshots are in `[project]/screenshots/` directories

### Sample Report:
- Threat Intelligence sample report: `Threat-Intelligence/reports/sample_threat_intel_report.md`
- Safe to display (uses benign test data)

---

## Screenshot Paths

Screenshots are organized by project:
- `Firewall-Setup/screenshots/` - 3 screenshots
- `Wireshark-Packet-Capture/screenshots/` - 5 screenshots
- `Log-Analysis/screenshots/` - 6 screenshots

**Note:** Screenshots should be displayed in project detail pages.

---

## Content Structure

### Homepage Should Show:
- Featured projects (3)
- Badge statistics (4 verified, 5 planned)
- Quick navigation to all projects
- Link to GitHub repo

### Project Detail Pages Should Show:
- Project badge
- Full description
- Skills demonstrated
- Tools used
- Evidence list
- Screenshots (if available)
- Link to GitHub project
- Link to README

### About/Overview Page Should Show:
- All projects grouped by badge type
- Project statistics
- Skills matrix
- Certifications

---

## Data Import Example

```typescript
// In your Next.js app
import projectsData from '../website-data/projects.json';

export default function ProjectsPage() {
  const { projects, badges, stats } = projectsData;
  
  const featuredProjects = projects.filter(p => p.featured);
  const completeProjects = projects.filter(p => p.status === 'complete');
  const plannedProjects = projects.filter(p => p.status === 'planned');
  
  return (
    // Your component JSX
  );
}
```

---

## Badge Component Example

```typescript
interface BadgeProps {
  type: 'verified-complete' | 'verified-api' | 'scaffold';
  label: string;
}

export function Badge({ type, label }: BadgeProps) {
  const colors = {
    'verified-complete': 'bg-green-100 text-green-800',
    'verified-api': 'bg-blue-100 text-blue-800',
    'scaffold': 'bg-gray-100 text-gray-800'
  };
  
  return (
    <span className={`px-2 py-1 rounded text-sm font-medium ${colors[type]}`}>
      {label}
    </span>
  );
}
```

---

## SEO Considerations

### Meta Tags:
- Title: "SOC Portfolio - [Your Name]"
- Description: "Cybersecurity portfolio demonstrating SOC analyst skills including Splunk log analysis, threat intelligence automation, and incident investigation workflows."
- Keywords: SOC, cybersecurity, Splunk, threat intelligence, incident response

### Open Graph:
- Use portfolio screenshot for OG image
- Include project count in description
- Link to GitHub repo

---

## Deployment Notes

### Cloudflare Pages:
- Build command: `npm run build`
- Output directory: `out` (for static export) or `.next` (for server-side)
- Environment variables: None required (all data is in JSON)

### GitHub Pages:
- Use static export: `next export`
- Output directory: `out`
- Base path: `/CyberSecurity-Projects` (if using subdirectory)

---

## Future Enhancements

### Phase 2 (After Site Launch):
1. Add project filtering by category
2. Add search functionality
3. Add project tags
4. Add "Last Updated" dates
5. Add project completion percentages

### Phase 3 (After Projects Complete):
1. Add interactive demos
2. Add video walkthroughs
3. Add live tool demonstrations
4. Add blog section for project updates

---

## Checklist Before Launch

- [ ] All project data imported correctly
- [ ] Badges display correctly
- [ ] Screenshots load properly
- [ ] GitHub links work
- [ ] Mobile responsive
- [ ] SEO meta tags set
- [ ] Analytics configured (optional)
- [ ] 404 page created
- [ ] Loading states handled
- [ ] Error boundaries in place

---

**Last Updated:** 2026-02-04  
**Purpose:** Guide for Next.js website integration
