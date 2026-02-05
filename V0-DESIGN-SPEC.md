# Portfolio Website Design Specification for v0

## Project Overview
Create a Next.js portfolio website to showcase cybersecurity projects. The site should be professional, clean, and highlight SOC (Security Operations Center) analyst skills.

**Tech Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS  
**Deployment:** Cloudflare Pages  
**Style:** Modern, professional, cybersecurity-themed (dark mode preferred)

---

## Data Structure

### Projects Data (JSON)
The website will consume `website-data/projects.json` with this structure:

```json
{
  "projects": [
    {
      "id": "soc-casefiles",
      "title": "SOC Casefiles",
      "category": "SOC Operations",
      "badge": "verified-complete",
      "badgeLabel": "✅ Verified Complete",
      "status": "complete",
      "priority": "high",
      "description": "Real-world incident investigation workflows...",
      "skills": ["Alert Triage", "Incident Documentation", ...],
      "tools": ["Markdown", "Documentation"],
      "evidence": ["5 complete casefiles", "4 operational playbooks"],
      "link": "/SOC-Casefiles/",
      "githubPath": "SOC-Casefiles/",
      "featured": true
    }
  ],
  "badges": [...],
  "stats": {...}
}
```

**Key Fields:**
- `featured: true` = Show on homepage (3 projects)
- `badge` = Badge type for styling
- `status` = "complete" or "planned"
- `githubPath` = GitHub repository path

---

## Badge System

### Three Badge Types:

1. **✅ Verified Complete** (Green)
   - Color: `bg-green-100 text-green-800` (light) or `bg-green-600 text-white` (dark)
   - Icon: Checkmark emoji or SVG
   - Use for: Fully complete projects

2. **🧪 Verified (API Tool Tested)** (Blue)
   - Color: `bg-blue-100 text-blue-800` (light) or `bg-blue-600 text-white` (dark)
   - Icon: Test tube emoji or SVG
   - Use for: Tools tested with live APIs

3. **📋 Planned / Scaffold** (Gray)
   - Color: `bg-gray-100 text-gray-800` (light) or `bg-gray-600 text-white` (dark)
   - Icon: Clipboard emoji or SVG
   - Use for: Planned projects

**Badge Component Requirements:**
- Small, pill-shaped badge
- Icon + text label
- Hover tooltip with description
- Accessible (aria-label)

---

## Page Structure

### 1. Homepage (`/`)
**Layout:**
- Hero section with name/title
- Featured projects section (3 projects, large cards)
- Quick stats (4 verified, 5 planned, 9 total)
- Skills overview (brief)
- CTA to view all projects

**Featured Projects Display:**
- Large project cards
- Badge prominently displayed
- Skills listed as tags
- "View Project" button
- Link to GitHub

### 2. Projects Page (`/projects`)
**Layout:**
- Filter by badge type (All, Verified, Planned)
- Filter by category
- Grid layout of project cards
- Search functionality (optional)

**Project Card:**
- Project title
- Badge (top-right)
- Description (truncated)
- Skills (as small tags)
- Tools (as small tags)
- "View Details" button
- Link to GitHub

### 3. Project Detail Page (`/projects/[id]`)
**Layout:**
- Project title
- Badge
- Full description
- Skills section (list)
- Tools section (list)
- Evidence section (bullet list)
- Screenshots gallery (if available)
- GitHub link (button)
- Back to projects link

**Sections:**
- Overview
- Skills Demonstrated
- Tools Used
- Evidence
- Screenshots (if available)
- Related Projects

### 4. Resources Page (`/resources`)
**Layout:**
- Templates section
- SOC Notes/Cheat Sheets section
- Grid layout of resource cards
- Download/view links

**Resource Cards:**
- Resource title
- Category (Template or Cheat Sheet)
- Brief description
- Link to GitHub file
- "View" button

**Templates Available:**
- Incident Report Template
- Ticket Notes Template
- Phishing Analysis Template

**SOC Notes Available:**
- Common Ports Cheat Sheet
- Windows Event IDs Reference
- SIEM Query Notes
- Phishing Indicators Guide

### 5. About Page (`/about`)
**Layout:**
- Personal introduction
- Professional summary (9+ years IT support, 10 years in March 2026, Security+ & CCST Cybersecurity certified)
- Work experience highlights (current: Amplifon, previous: NTT Data, Veritas, Compucom)
- Skills matrix
- Certifications (CompTIA Security+ 2025, CCST Cybersecurity 2025, CompTIA A+ 2017)
- Contact information
- GitHub link
- LinkedIn link
- Portfolio website link
- Resume link (optional)

---

## Component Specifications

### Badge Component
```tsx
<Badge 
  type="verified-complete" | "verified-api" | "scaffold"
  label="✅ Verified Complete"
/>
```

**Styling:**
- Small pill shape
- Icon + text
- Color-coded
- Responsive

### Project Card Component
```tsx
<ProjectCard 
  project={projectData}
  featured={boolean}
/>
```

**Features:**
- Badge display
- Title
- Description (truncate if long)
- Skills as tags
- Tools as tags
- Link to detail page
- Link to GitHub

### Stats Component
```tsx
<Stats 
  total={9}
  complete={4}
  planned={5}
/>
```

**Display:**
- Large numbers
- Labels
- Visual indicators (progress bars optional)

---

## Design Requirements

### Color Scheme
**Dark Mode Preferred:**
- Background: Dark gray/black (`#0a0a0a` or `#111827`)
- Text: Light gray/white (`#f9fafb`)
- Accent: Blue/cyan for links (`#3b82f6` or `#06b6d4`)
- Badge colors: Green, Blue, Gray (as specified)

**Light Mode (Optional):**
- Background: White/light gray
- Text: Dark gray/black
- Accent: Blue
- Badge colors: Lighter shades

### Typography
- Headings: Bold, modern sans-serif (Inter, Poppins, or similar)
- Body: Clean, readable (Inter, System UI)
- Code: Monospace (Fira Code, JetBrains Mono)

### Spacing
- Generous whitespace
- Consistent padding/margins
- Mobile-responsive spacing

### Icons
- Use emoji or SVG icons
- Consistent icon style
- Accessible (aria-labels)

---

## Data Integration Points

### Import Statement
```typescript
import projectsData from '@/data/projects.json';
// or
import projectsData from '../website-data/projects.json';
```

### Data Access
```typescript
// Projects data
import projectsData from '@/data/projects.json';
const { projects, badges, stats, categories } = projectsData;

// Resources data
import resourcesData from '@/data/resources.json';
const { templates, cheatSheets } = resourcesData;

// Featured projects
const featured = projects.filter(p => p.featured);

// Complete projects
const complete = projects.filter(p => p.status === 'complete');

// By badge type
const verified = projects.filter(p => 
  p.badge === 'verified-complete' || p.badge === 'verified-api'
);
```

---

## Routing Structure

```
/                    → Homepage
/projects            → All projects
/projects/[id]       → Project detail page
/resources           → Templates & SOC Notes
/about               → About page
```

**Dynamic Routes:**
- Use Next.js App Router
- `[id]` should match project `id` from JSON
- Handle 404 for invalid project IDs

---

## GitHub Integration

### Links Format
```typescript
const githubBaseUrl = 'https://github.com/[username]/CyberSecurity-Projects';
const projectUrl = `${githubBaseUrl}/tree/main/${project.githubPath}`;
```

### GitHub Buttons
- "View on GitHub" button on project cards
- "View Source" button on detail pages
- GitHub icon (use GitHub logo SVG or icon library)

---

## Screenshot Handling

### Path Structure
Screenshots are in: `[project]/screenshots/`

**Display:**
- Gallery on project detail pages
- Lightbox/modal for full-size viewing
- Lazy loading for performance
- Alt text for accessibility

**Projects with Screenshots:**
- Firewall-Setup (3 screenshots)
- Wireshark-Packet-Capture (5 screenshots)
- Log-Analysis (6 screenshots)

---

## Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile Considerations
- Stack project cards vertically
- Hamburger menu for navigation
- Touch-friendly buttons
- Readable text sizes

---

## Performance Requirements

- Fast page loads
- Optimized images (Next.js Image component)
- Lazy loading for project cards
- Static generation where possible
- Minimal JavaScript bundle

---

## SEO Requirements

### Meta Tags
```html
<title>SOC Portfolio - Michael Walton | Cybersecurity Projects</title>
<meta name="description" content="Cybersecurity portfolio by Michael Walton demonstrating SOC analyst skills including Splunk log analysis, threat intelligence automation, and incident investigation workflows. 9+ years IT support experience (10 years in March 2026), Security+ and CCST Cybersecurity certified.">
<meta name="keywords" content="SOC, cybersecurity, Splunk, threat intelligence, incident response, Michael Walton, Minneapolis">
```

### Open Graph
- OG image (portfolio screenshot)
- OG title
- OG description
- OG URL

---

## Accessibility Requirements

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Screen reader friendly
- Color contrast (WCAG AA minimum)
- Focus indicators

---

## Additional Features (Optional)

### Search
- Search projects by name, skills, or tools
- Client-side filtering

### Filtering
- Filter by badge type
- Filter by category
- Filter by status

### Sorting
- Sort by priority
- Sort by name
- Sort by completion date (if added)

---

## Example Component Structure

```
components/
  Badge.tsx
  ProjectCard.tsx
  ProjectGrid.tsx
  Stats.tsx
  Navigation.tsx
  Footer.tsx

app/
  page.tsx (homepage)
  projects/
    page.tsx (all projects)
    [id]/
      page.tsx (project detail)
  resources/
    page.tsx (templates & SOC notes)
  about/
    page.tsx

data/
  projects.json (from website-data/)
```

---

## Styling Approach

### Tailwind CSS Classes
Use Tailwind utility classes for:
- Colors (badge colors, backgrounds)
- Spacing (padding, margins)
- Typography (font sizes, weights)
- Layout (grid, flexbox)
- Responsive design (breakpoints)

### Custom Styles
- Badge component styles
- Project card hover effects
- Link hover effects
- Dark mode toggle (if implemented)

---

## Resources Section

### Templates
Located in: `Templates/` directory

**Available Templates:**
1. **Incident Report Template** (`Templates/Incident-Report-Template.md`)
   - Standard incident report format
   - Includes: Summary, Investigation, Findings, Resolution, Ticket Notes

2. **Ticket Notes Template** (`Templates/Ticket-Notes-Template.md`)
   - Ticketing system documentation format
   - Concise and detailed formats
   - Quick reference fields

3. **Phishing Analysis Template** (`Templates/Phishing-Analysis-Template.md`)
   - Email header analysis
   - URL/IP reputation checks
   - IOC extraction
   - Verdict and recommendations

### SOC Notes (Cheat Sheets)
Located in: `SOC-Notes/` directory

**Available Cheat Sheets:**
1. **Common Ports Cheat Sheet** (`SOC-Notes/Common-Ports-CheatSheet.md`)
   - Well-known ports (0-1023)
   - Registered ports (1024-49151)
   - Common malicious ports
   - SOC analysis tips

2. **Windows Event IDs** (`SOC-Notes/Windows-Event-IDs.md`)
   - Authentication events (4624, 4625, etc.)
   - Account management events
   - Process & service events
   - Network events
   - Common SOC queries

3. **SIEM Query Notes** (`SOC-Notes/SIEM-Query-Notes.md`)
   - Common Splunk queries
   - Authentication & access queries
   - Process & execution queries
   - Network activity queries
   - Performance tips

4. **Phishing Indicators** (`SOC-Notes/Phishing-Indicators.md`)
   - Email header indicators
   - Subject line red flags
   - Sender indicators
   - URL analysis
   - IOC types

**Resource Display:**
- Card layout similar to projects
- Category badge (Template or Cheat Sheet)
- Description
- Link to GitHub markdown file
- "View on GitHub" button
- Optional: Preview/snippet of content

## Content Placeholders

### Homepage Hero
```
Michael Walton
Information Technology Professional | SOC / Cybersecurity Analyst
Portfolio showcasing hands-on security analysis skills
9+ years IT support experience (10 years in March 2026) | Security+ & CCST Cybersecurity Certified
```

### Homepage Sections
- Featured Projects (3)
- Quick Stats
- Resources Preview (link to full resources page)
- Skills Overview

### Project Description Example
```
"Real-world incident investigation workflows with complete documentation. 
Demonstrates alert triage, IOC extraction, and ticket documentation skills."
```

### Resource Description Example
```
"Professional incident report template following industry-standard format.
Includes investigation steps, IOC documentation, and ticket notes sections."
```

### Skills Tags
Small, rounded tags showing: "Splunk", "Python", "Wireshark", etc.

---

## GitHub Repository Integration

### Repository Info
- Username: `GreyKeyStudios`
- Repository: `CyberSecurity-Projects`
- Base URL: `https://github.com/GreyKeyStudios/CyberSecurity-Projects`
- Portfolio Website: `https://resume.greykeystudios.com`

### Links Needed
- Main repo link
- Project-specific links (`/tree/main/[path]`)
- README links
- Sample report links (Threat-Intelligence)

---

## Deployment Configuration

### Cloudflare Pages
- Build command: `npm run build`
- Output directory: `out` (static) or `.next` (SSR)
- Node version: 18+ or 20+

### Environment Variables
- None required (all data in JSON)
- Optional: Analytics IDs, contact form keys

---

## Design Inspiration Notes

**Style Keywords:**
- Professional
- Clean
- Modern
- Cybersecurity-themed
- Technical but approachable
- Portfolio/showcase style

**Reference Sites:**
- Developer portfolios
- Technical documentation sites
- Security company websites
- GitHub profile pages

**Avoid:**
- Overly complex animations
- Cluttered layouts
- Hard-to-read fonts
- Poor mobile experience

---

## Data File Location

The `projects.json` file will be located at:
```
website-data/projects.json
```

**Import Paths:**
```typescript
// Projects data
import projectsData from '../website-data/projects.json';
// or
import projectsData from '@/data/projects.json'; // if moved to data/

// Resources data
import resourcesData from '../website-data/resources.json';
// or
import resourcesData from '@/data/resources.json'; // if moved to data/
```

**Data Files:**
- `website-data/projects.json` - All project metadata
- `website-data/resources.json` - Templates and cheat sheets metadata

---

## Checklist for v0

Before generating code, ensure:
- [ ] Understands badge system (3 types, colors)
- [ ] Understands project data structure
- [ ] Knows featured projects (3 on homepage)
- [ ] Understands routing structure
- [ ] Knows GitHub integration needs
- [ ] Understands responsive requirements
- [ ] Knows dark mode preference
- [ ] Understands accessibility needs

---

## Final Notes

**Priority:**
1. Homepage with featured projects
2. Projects listing page
3. Project detail pages
4. Resources page (Templates & SOC Notes)
5. About page

**Nice to Have:**
- Search functionality
- Filtering
- Dark mode toggle
- Animations (subtle)

**Must Have:**
- Badge system working
- GitHub links working
- Resources section (Templates & SOC Notes)
- Responsive design
- Fast loading
- Accessible

**Resources Section Features:**
- Display templates and cheat sheets
- Link to GitHub markdown files
- Category filtering (Templates vs. Cheat Sheets)
- Search functionality (optional)
- Preview snippets (optional)

---

**Ready for v0 to generate the Next.js code!**

Once generated, the code will be ready to:
1. Import `projects.json` data
2. Display projects with badges
3. Link to GitHub
4. Show screenshots
5. Be deployed to Cloudflare Pages
