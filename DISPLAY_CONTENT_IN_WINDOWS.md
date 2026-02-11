# Display Actual Content in Windows

## What Changed

Templates and Cheat Sheets now fetch and display the **actual markdown content** from GitHub directly in the desktop windows, instead of just showing a link to GitHub.

## Key Improvements

### Before
- Clicking "View Content" showed a message: "This is stored on GitHub, click to view"
- Had to leave the VM to see the content
- GitHub link was the only option

### After
- Clicking "View Content" **fetches and renders the actual markdown** in the window
- Content displays with full formatting (headers, code blocks, lists, etc.)
- GitHub button is still there as a **backup/additional option**
- Stay in the VM while viewing content

## Implementation

### 1. Added Client-Side Content Fetching

**Templates Component:**
```typescript
const [content, setContent] = useState<string | null>(null)
const [loading, setLoading] = useState(false)

useEffect(() => {
  if (template) {
    setLoading(true)
    fetch(`${GITHUB_RAW_BASE}/${template.githubPath}`)
      .then(res => res.ok ? res.text() : null)
      .then(text => setContent(text && text.length > 50 ? text : null))
  }
}, [template])
```

### 2. Content Display States

**Loading State:**
```
┌─────────────────────────┐
│ Loading content...      │
└─────────────────────────┘
```

**Success State:**
```
┌─────────────────────────┐
│ [Icon] Template Title   │
│ Description             │
│ [GitHub Button]         │
│                         │
│ ┌─────────────────────┐ │
│ │ # Markdown Content  │ │
│ │ - Formatted         │ │
│ │ - With syntax       │ │
│ │ - Scrollable        │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

**Error State:**
```
┌─────────────────────────┐
│ Content could not load  │
│ [View on GitHub Button] │
└─────────────────────────┘
```

### 3. Markdown Rendering

Uses existing `MarkdownContent` component:
- Full GitHub-flavored markdown support
- Syntax highlighting for code blocks
- Styled tables, lists, blockquotes
- Links open in new browser tabs
- Images with borders
- Responsive layout

### 4. GitHub Button Placement

**Detail View:**
- Small outline button with GitHub icon
- Positioned at top with title/description
- Acts as backup if content fails to load
- Opens in real browser tab (external link)

## User Experience

### Viewing a Template

1. Open Templates app
2. Click "View Content" on "Phishing Analysis Template"
3. Window navigates to detail view
4. Shows "Loading content..." briefly
5. **Markdown content appears** with full formatting
6. Can scroll within the window to read everything
7. "View on GitHub" button available as backup
8. Click back → Return to list

### Content Features

**What Gets Rendered:**
- ✅ Headers (H1, H2, H3, etc.)
- ✅ Bold, italic, strikethrough text
- ✅ Code blocks with syntax highlighting
- ✅ Inline code with background
- ✅ Lists (ordered and unordered)
- ✅ Tables with borders
- ✅ Blockquotes
- ✅ Links (open in new tabs)
- ✅ Images (if any in markdown)
- ✅ Checkboxes (GitHub-flavored markdown)

## Files Modified

**`/app/resources/page.tsx`**
1. Added imports:
   - `useState`, `useEffect` from React
   - `MarkdownContent` component
   - `GITHUB_RAW_BASE` constant
2. Updated `TemplatesContent`:
   - Added state for `content` and `loading`
   - Added `useEffect` to fetch content from GitHub raw URL
   - Renders markdown with `<MarkdownContent>`
   - Shows loading state while fetching
   - Shows error state if fetch fails
   - GitHub button moved to header area
3. Updated `CheatSheetsContent`:
   - Same pattern as Templates
   - Fetches and displays markdown content
   - Loading and error states

## GitHub Raw URL

Content is fetched from:
```
https://raw.githubusercontent.com/GreyKeyStudios/CyberSecurity-Projects/main/{githubPath}
```

Example:
```
https://raw.githubusercontent.com/GreyKeyStudios/CyberSecurity-Projects/main/Investigation-Templates/Phishing-Email-Analysis.md
```

## Benefits

✅ **No context switching** - View content without leaving VM  
✅ **Professional UX** - Like viewing files in a real OS  
✅ **Full formatting** - Markdown renders beautifully  
✅ **Scrollable** - Long content scrolls within window  
✅ **GitHub backup** - Still easy to view on GitHub if needed  
✅ **Fast loading** - Fetches from GitHub's CDN  
✅ **Error handling** - Graceful fallback if content fails  

## Testing

1. Launch SOC OS
2. Open Templates app
3. Click "View Content" on any template
4. Should see:
   - Brief loading message
   - Then full markdown content
   - Formatted headers, lists, code blocks
   - Scroll to see full content
5. Click "View on GitHub" button → Opens in browser tab
6. Click back button → Return to list
7. Try Cheat Sheets app - same behavior

**Server: http://localhost:3001/resources**
