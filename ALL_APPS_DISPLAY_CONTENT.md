# All Apps Now Display Content

## What Changed

Updated **all apps that have content** to fetch and display it directly in the windows:

### Apps with Content Display (5 total)

1. ✅ **Templates** - Investigation templates, incident reports
2. ✅ **Cheat Sheets** - Common ports, Windows Event IDs, SIEM queries, phishing indicators
3. ✅ **Code Examples** - Python scripts, Splunk queries, regex extractors
4. ✅ **Interview Prep** - SOC interview questions, STAR method, incident explanation

### Apps Without Content (External Links Only)

5. **30-Min Practice** - No external content, just task lists
6. **Learning Paths** - External links to TryHackMe, Roadmap.sh, etc.
7. **Daily Tools** - External links to VirusTotal, AbuseIPDB, etc.
8. **Practice Labs** - External links to TryHackMe rooms, CyberDefenders, etc.
9. **IOC Helper** - Opens full tool in new tab (internal app, not content)

## Implementation Details

### Code Examples Component

**Pattern:** Simple state-based navigation (no URL stack needed)

```typescript
const [selectedExample, setSelectedExample] = useState<any>(null)
const [content, setContent] = useState<string | null>(null)
const [loading, setLoading] = useState(false)

// Fetch when example selected
useEffect(() => {
  if (selectedExample) {
    fetch(`${GITHUB_RAW_BASE}/${selectedExample.githubPath}`)
      .then(res => res.text())
      .then(setContent)
  }
}, [selectedExample])
```

**Navigation:**
- List view → Click "View Code" → Sets `selectedExample`
- Detail view → Shows code with syntax highlighting
- "← Back to Scripts" button → Clears `selectedExample`

### Interview Prep Component

**Same pattern as Code Examples:**
- State-based navigation
- Fetch content on selection
- Back button to return to list
- GitHub backup link

### Rendering Features

All content components now support:
- ✅ Markdown rendering with syntax highlighting
- ✅ Code blocks with language-specific highlighting
- ✅ Tables, lists, blockquotes
- ✅ Links (open in new tabs)
- ✅ Scrollable content area
- ✅ Loading states
- ✅ Error fallbacks
- ✅ GitHub backup buttons

## Visual Examples

### Code Examples Flow

**List View:**
```
┌─────────────────────────────┐
│ Automation Scripts          │
│                             │
│ ┌─────────────────────────┐ │
│ │ IOC Enrichment Script   │ │
│ │ Python                  │ │
│ │ [View Code] [GitHub]    │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ Log Parser Examples     │ │
│ │ Python                  │ │
│ │ [View Code] [GitHub]    │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**Detail View:**
```
┌─────────────────────────────┐
│ ← Back to Scripts           │
│ 💻 IOC Enrichment Script    │
│ Python                      │
│ [View on GitHub 🔗]        │
│                             │
│ ┌─────────────────────────┐ │
│ │ ```python               │ │
│ │ import requests         │ │
│ │ import json             │ │
│ │                         │ │
│ │ def enrich_ioc(ioc):    │ │
│ │     ...                 │ │
│ │ ```                     │ │
│ │ (scrollable...)         │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Interview Prep Flow

**List View:**
```
┌─────────────────────────────┐
│ Interview Prep              │
│                             │
│ ┌─────────────────────────┐ │
│ │ Common SOC Questions    │ │
│ │ [Read Guide] [GitHub]   │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ STAR Method Guide       │ │
│ │ [Read Guide] [GitHub]   │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**Detail View:**
```
┌─────────────────────────────┐
│ ← Back to Interview Prep    │
│ 💼 Common SOC Questions     │
│ [View on GitHub 🔗]        │
│                             │
│ ┌─────────────────────────┐ │
│ │ # Technical Questions   │ │
│ │                         │ │
│ │ ## Network Analysis     │ │
│ │ 1. What is...           │ │
│ │ 2. How do you...        │ │
│ │                         │ │
│ │ (scrollable...)         │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

## Content Types Supported

### Python Scripts (.py)
- Syntax-highlighted Python code
- Full script with comments
- Import statements, functions, classes

### Markdown Files (.md)
- Headers, paragraphs, lists
- Code blocks with syntax highlighting
- Tables, blockquotes
- Links (open in new tabs)

### SPL Queries
- Splunk query syntax
- Comments and explanations
- Use case examples

## Back Button Implementation

**Code Examples & Interview Prep** use a simpler approach than Templates/Cheat Sheets:

**Templates/Cheat Sheets:**
- Use window navigation stack (browser-style history)
- Back/forward buttons in navigation bar
- Supports complex navigation paths

**Code Examples/Interview Prep:**
- Simple state toggle (show list vs show detail)
- "← Back" button in content area
- Simpler for single-level navigation

## Files Modified

**`/app/resources/page.tsx`**
1. **CodeExamplesContent:**
   - Added `selectedExample`, `content`, `loading` state
   - Added `useEffect` to fetch content
   - Added detail view with back button
   - Renders markdown with `<MarkdownContent>`
   - GitHub button as backup

2. **InterviewPrepContent:**
   - Same pattern as Code Examples
   - Simple state-based navigation
   - Fetch and display content
   - Back button to list

## Summary by App

| App | Has Content | Display Type | Navigation |
|-----|------------|--------------|------------|
| Templates | ✅ | Markdown | Window stack (◀▶) |
| Cheat Sheets | ✅ | Markdown | Window stack (◀▶) |
| Code Examples | ✅ | Code/Markdown | State toggle (← Back) |
| Interview Prep | ✅ | Markdown | State toggle (← Back) |
| 30-Min Practice | ❌ | Task cards | N/A |
| Learning Paths | ❌ | External links | N/A |
| Daily Tools | ❌ | External links | N/A |
| Practice Labs | ❌ | External links | N/A |
| IOC Helper | ❌ | Internal tool | Opens new tab |

## Testing

**Test each app:**

1. **Code Examples:**
   - Open app
   - Click "View Code" on any script
   - See Python/SPL code rendered
   - Click "← Back to Scripts"
   - Try different examples

2. **Interview Prep:**
   - Open app
   - Click "Read Guide"
   - See markdown questions/guides
   - Click "← Back to Interview Prep"
   - Try all 3 guides

3. **Templates & Cheat Sheets:**
   - Already working from previous update
   - Should still display content correctly

**Server: http://localhost:3001/resources**

All apps with GitHub content now display it beautifully in the windows!
