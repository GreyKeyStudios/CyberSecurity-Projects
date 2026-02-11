# In-Window Browser Navigation System

## Overview

Each desktop window now functions like a mini web browser with its own navigation stack, back/forward buttons, and the ability to "navigate" between views without leaving the VM or opening new browser tabs.

## What Changed

### Problem
- Internal links (Templates, Cheat Sheets) were opening in new browser tabs
- Users left the VM experience when viewing content
- No way to go back without closing the window

### Solution
- Each window has its own **navigation stack** (like browser history)
- **Back/Forward buttons** appear below the title bar (like a browser)
- Clicking "View Content" navigates **within the window**
- External links (GitHub, VirusTotal, etc.) still open in real browser tabs

## Implementation

### 1. Window State Management

**Extended `WindowState` interface:**
```typescript
interface WindowState {
  id: string
  isOpen: boolean
  isMinimized: boolean
  zIndex: number
  navigationStack: string[]      // History of paths
  currentNavIndex: number         // Current position in history
}
```

**Navigation Functions:**
- `navigateInWindow(windowId, path)` - Navigate to new path, clear forward history
- `goBack(windowId)` - Move back in history
- `goForward(windowId)` - Move forward in history

### 2. DesktopWindow Component

**Added Props:**
- `canGoBack?: boolean` - Enable/disable back button
- `canGoForward?: boolean` - Enable/disable forward button
- `onGoBack?: () => void` - Back button callback
- `onGoForward?: () => void` - Forward button callback

**New UI Element - Navigation Bar:**
```tsx
<div className="flex items-center gap-1 px-2 py-1.5 bg-muted/30 border-b border-border">
  <button onClick={onGoBack} disabled={!canGoBack}>
    <ChevronLeft />
  </button>
  <button onClick={onGoForward} disabled={!canGoForward}>
    <ChevronRight />
  </button>
</div>
```

**Features:**
- Appears below title bar (when navigation props provided)
- Back/forward buttons with chevron icons
- Disabled state (opacity-30, cursor-not-allowed) when can't navigate
- Hover effects on enabled buttons
- Tooltips: "Go back", "Go forward"

### 3. Content Components with Navigation

**Templates Component:**
```typescript
function TemplatesContent({ 
  templates, 
  currentPath,        // e.g., "templates" or "templates:phishing-template"
  onNavigate 
}: { 
  templates: any[], 
  currentPath: string, 
  onNavigate: (path: string) => void 
})
```

**Path Format:**
- List view: `"templates"`
- Detail view: `"templates:template-id"`

**Views:**
1. **List View** - Shows all templates as cards
   - Click "View Content" → `onNavigate("templates:template-id")`
   - Adds to navigation stack
2. **Detail View** - Shows template info + GitHub link
   - Shows title, description
   - Link to GitHub (opens in real browser tab)
   - Click back button → Returns to list

**Same pattern for CheatSheetsContent:**
- List: `"cheat-sheets"`
- Detail: `"cheat-sheets:sheet-id"`

### 4. Navigation Flow Example

**User opens Templates app:**
```
navigationStack: ["templates"]
currentNavIndex: 0
View: List of templates
```

**User clicks "View Content" on Phishing Template:**
```
navigationStack: ["templates", "templates:phishing-template"]
currentNavIndex: 1
View: Phishing template detail
Back button: ENABLED
```

**User clicks Back:**
```
navigationStack: ["templates", "templates:phishing-template"]
currentNavIndex: 0
View: List of templates
Forward button: ENABLED
```

**User clicks "View Content" on different template:**
```
navigationStack: ["templates", "templates:ticket-notes"]
currentNavIndex: 1
View: Ticket notes detail
Forward button: DISABLED (history cleared)
```

## User Experience

### Internal Navigation (Templates, Cheat Sheets)
1. Open Templates app
2. See list of templates
3. Click "View Content" → Navigates within window
4. See template detail with GitHub link
5. Click back button → Return to list
6. Window stays open, no new tabs

### External Links
- **GitHub links** → Open in real browser tab
- **External tools** (VirusTotal, TryHackMe, etc.) → Open in real browser tab
- User can keep VM window open while viewing external content

### Navigation Bar Behavior
- **Only appears** for apps that support navigation (Templates, Cheat Sheets)
- **Apps without navigation** (30-Min Practice, Tools, Labs) → No nav bar
- **Disabled buttons** are grayed out and non-clickable
- **Enabled buttons** have hover effects

## Files Modified

1. **`/app/resources/page.tsx`**
   - Extended `WindowState` interface with navigation
   - Added `navigateInWindow`, `goBack`, `goForward` functions
   - Updated window rendering to pass navigation props
   - Updated `TemplatesContent` with navigation support
   - Updated `CheatSheetsContent` with navigation support
   - Changed IOC Helper to use `<a>` tag for external link

2. **`/components/desktop-window.tsx`**
   - Added navigation props to interface
   - Imported `ChevronLeft`, `ChevronRight` icons
   - Added navigation bar UI below title bar
   - Conditional rendering based on navigation props

## Visual Layout

```
┌─────────────────────────────────────┐
│ ●●●  Templates.app                  │ ← Title bar (draggable)
├─────────────────────────────────────┤
│ ◀ ▶                                 │ ← Navigation bar (NEW)
├─────────────────────────────────────┤
│                                     │
│  [Content area with scroll]         │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

## Benefits

✅ **Stay in VM** - Never leave the desktop OS experience  
✅ **Browser-like** - Familiar back/forward navigation  
✅ **No new tabs** - Internal navigation is contained  
✅ **External links still work** - Open in real browser when needed  
✅ **Per-window history** - Each app has its own navigation stack  
✅ **Clear UI feedback** - Disabled state shows when you can't navigate  

## Testing

1. Open Templates app
2. Click "View Content" on any template
3. See detail view appear
4. Notice back button is enabled (◀)
5. Click back → Return to list
6. Forward button now enabled (▶)
7. Click forward → Back to detail view
8. Click "View on GitHub" → Opens in real browser tab (VM stays open)

Server: **http://localhost:3001/resources**
