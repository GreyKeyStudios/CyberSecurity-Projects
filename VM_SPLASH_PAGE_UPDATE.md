# VM Splash Page & Full-Screen Desktop OS

## What Changed

Completely redesigned the resources page UX to work like launching a virtual machine or remote desktop application.

### New User Flow

1. **Land on Splash Page** → See description and instructions
2. **Click "Launch SOC Operating System"** → Full-screen VM opens
3. **Use the Desktop OS** → Can't scroll the page, only content within windows
4. **Exit VM (X button)** → Return to splash page, continue browsing site

### Why This Is Better

✅ **Intuitive** - Clearly separates "info about the OS" from "using the OS"  
✅ **Immersive** - Full viewport = feels like a real VM  
✅ **Clean** - No more scrolling confusion between page and windows  
✅ **Professional** - Matches how actual remote desktop / VM clients work  
✅ **Flexible** - Can return to splash and navigate rest of site  

## Implementation Details

### Splash Page (`!isVMActive`)

**Layout:**
- Large centered header with Shield icon
- Description paragraphs (2 sections)
- Big "Launch SOC Operating System" button with Monitor icon
- Two info cards side-by-side:
  - **What's Inside** - Lists all 9 resource categories
  - **How to Use the Desktop OS** - Control instructions

**Styling:**
- `min-h-screen` - Takes full height
- `py-16` - Generous padding
- Gradient background: `from-background to-muted/20`
- Cards with `bg-card/50` for subtle transparency

### Full-Screen VM (`isVMActive`)

**Container:**
- `fixed inset-0 z-50` - Covers entire viewport
- `bg-black` - Black background (VM style)
- Prevents body scroll via `useEffect` hook

**Exit Button:**
- Fixed top-right position
- Red background (`bg-red-500/90`)
- High z-index (100) to stay above everything
- X icon from Lucide
- Hover effects: scale and color change

**Desktop Monitor:**
- `id="desktop-monitor"` - Full height/width of viewport
- `h-full w-full` - 100% of the fixed container
- Dark gradient background (slate-900/800)
- Desktop icons grid (4-6-8 columns responsive)
- Integrated taskbar at bottom (56px height)

### State Management

```typescript
const [isVMActive, setIsVMActive] = useState(false)

useEffect(() => {
  if (isVMActive) {
    document.body.style.overflow = 'hidden' // Prevent background scroll
  } else {
    document.body.style.overflow = 'auto'
  }
  return () => {
    document.body.style.overflow = 'auto' // Cleanup
  }
}, [isVMActive])
```

### Window Adjustments

Updated `DesktopWindow` component for full-viewport operation:
- Windows use viewport-based sizing: `clamp(400px, 60vw, 900px)`
- Max height: `calc(100vh - 200px)` (leaves room for taskbar)
- Maximize fills almost entire viewport: `calc(100vh - 80px)`
- Content area: `max-h-[calc(100vh-260px)]` or `h-[calc(100vh-140px)]` when maximized
- Drag boundaries still constrained to monitor area

## Files Modified

1. **`/app/resources/page.tsx`**
   - Added `isVMActive` state
   - Added `useEffect` for body scroll control
   - Split return into two modes: splash vs VM
   - Imported `X` and `Monitor` icons from Lucide
   - Created splash page layout with cards
   - Wrapped desktop in full-screen overlay

2. **`/components/desktop-window.tsx`**
   - Updated sizing to use viewport units
   - Adjusted maximize behavior for full-screen VM
   - Content area heights use `vh` instead of fixed values

## User Experience

### Before
- Scrolling page with embedded "monitor"
- Confusing scroll behavior (page vs windows)
- Instructions at top, monitor in middle
- No clear entry/exit point

### After
- Clear splash page with "Launch" button
- Full-screen immersive VM experience
- No page scrolling when in VM (only window content)
- Obvious exit button (red X top-right)
- Can return to splash and continue browsing

## What It Looks Like

**Splash Page:**
```
╔═══════════════════════════════════════╗
║     🛡️  My SOC Operating System      ║
║                                       ║
║  [Description paragraphs]             ║
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │ 🖥️ Launch SOC Operating System  │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  ┌─────────────┐  ┌─────────────┐   ║
║  │What's Inside│  │How to Use   │   ║
║  └─────────────┘  └─────────────┘   ║
╚═══════════════════════════════════════╝
```

**VM Mode (Full Screen):**
```
╔═══════════════════════════════════════╗ [X]
║ 🖥️ SOC OS Desktop                     ║
║                                       ║
║  [Icons]  [Icons]  [Icons]  [Icons]  ║
║                                       ║
║  [Open Windows - Draggable]           ║
║                                       ║
║ ──────────────────────────────────── ║
║ [Taskbar] SOC OS v1.0                ║
╚═══════════════════════════════════════╝
```

## Testing

Server running at: **http://localhost:3001/resources**

1. Load `/resources` → Should see splash page
2. Click "Launch SOC Operating System" → VM opens full screen
3. Double-click icons → Windows open
4. Try dragging → Windows stay in bounds
5. Try scrolling page → Page doesn't scroll (only window content)
6. Click red X → Returns to splash page
7. Scroll down on splash → Can browse normally

## Next Enhancements (Optional)

- Fade transition between splash and VM
- Loading animation when launching VM
- Keyboard shortcut to exit VM (ESC key)
- Remember which apps were open when returning to VM
- Add "boot up" animation on launch
- VM window title bar with "SOC OS - Remote Session"
