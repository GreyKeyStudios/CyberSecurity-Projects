# Website Data Files

This directory contains structured data for the Next.js portfolio website.

## Files

### `projects.json`
Complete project metadata including:
- Project details (title, description, skills, tools)
- Badge assignments
- Status and priority
- Evidence lists
- GitHub paths

### `badges.md`
Badge system documentation and guidelines for website implementation.

## Usage

These files can be imported into your Next.js application:

```typescript
import projectsData from './website-data/projects.json';

// Access projects
const projects = projectsData.projects;
const featuredProjects = projects.filter(p => p.featured);

// Access badges
const badges = projectsData.badges;

// Access stats
const stats = projectsData.stats;
```

## Badge System

Three badge types:
- ✅ **Verified Complete** - Fully complete projects
- 🧪 **Verified (API Tool Tested)** - Tested tools/scripts
- 📋 **Planned / Scaffold** - Planned projects

## Integration Notes

- Projects are sorted by priority (high → low)
- Featured projects should be highlighted on homepage
- Badge colors should match the system (green, blue, gray)
- All project links should point to GitHub paths

---

**Purpose:** Provide structured data for website display  
**Format:** JSON for easy import into Next.js  
**Maintained:** Update when projects change status
