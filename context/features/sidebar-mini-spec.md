# Mini Sidebar

## Overview

A compact icon-only sidebar (48px wide) that provides quick navigation to all major sections without expanding the full sidebar.

## Requirements

- Always visible on mobile (< lg breakpoint) alongside the mobile drawer trigger
- Shown on desktop when the full sidebar is collapsed
- Sections are separated by visible horizontal rules (`border-muted-foreground/30`, `my-1.5`)
- **Toggle** — `PanelLeftOpen` button at top; hidden on mobile when drawer is open
- **Pinned group** — filled `Pin` icon linking to the most recently updated pinned collection; hidden when no pinned collection exists
- **Types group** — one icon per system item type, colored by type color, linking to `/items/{typename}`
- **Collections group**
  - `FolderOpen` icon → `/collections` (all collections)
  - Filled pink `Heart` → most recent favorite collection (hidden if none)
  - Colored circle (dominant item type color) → most recent collection (hidden if none)
- **Items group**
  - `Library` icon → `/items` (all items)
  - Filled yellow `Star` → most recent favorite item (hidden if none)
  - Colored circle (item type color) → most recent item (hidden if none)
- **Footer** — user initials avatar, always pinned to bottom

## Implementation Notes

- `MiniSidebarContent` receives `pinnedCollections`, `favoriteCollections`, `recentCollections`, `favoriteItems`, `recentItems` as props; all sliced to `[0]` inside the component
- `getDominantTypeColor` (already in `Sidebar.tsx`) used for collection circles
- Conditional items render nothing (not a placeholder) when the backing data is absent
- Both the desktop collapsed aside and the mobile mini aside render `MiniSidebarContent` with identical props

## References

- Implementation: `src/components/layout/Sidebar.tsx` — `MiniSidebarContent` function
- Context provider: `src/components/layout/sidebar-context.tsx`
- Prop types: `src/types/sidebar.ts`
