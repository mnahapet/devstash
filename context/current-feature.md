# Current Feature

Dashboard UI Phase 3 - Main area with stats cards, recent collections, pinned items, and recent items.

## Status

Completed

## Goals

## Notes

- Reference screenshots: @context/screenshots/dashboard-ui-main.png, @context/screenshots/dashboard-ui-drawer.png
- See @context/project-overview.md for full context
- Mock data available at @src/lib/mock-data.ts
- Spec: @context/features/dashboard-phase-3-spec.md

## History

- next.js cleanup and tailwind setup
- Dashboard UI Phase 1: ShadCN setup, dashboard route, top bar with centered search, logo icon, dark mode, sidebar/main placeholders
  - [x] ShadCN UI initialization and components
  - [x] ShadCN component installation
  - [x] Dashboard route at /dashboard
  - [x] Main dashboard layout and any global styles
  - [x] Dark mode by default
  - [x] Top bar with search and new item button (display only)
  - [x] Placeholder for sidebar and main area. Just add an h2 with "Sidebar" and "Main" for now.
- Dashboard UI Phase 2: Collapsible sidebar with navigation, collections, and user avatar
  - [x] Collapsible sidebar
  - [x] Items/types with links to /items/TYPE (e.g. /items/snippets)
  - [x] Favorite collections
  - [x] Most recent collections
  - [x] User avatar area at the bottom
  - [x] Drawer icon to open/close sidebar
  - [x] Always a drawer on mobile view
- Dashboard UI Phase 3: Main area with stats cards, recent collections, pinned items, and recent items
  - [x] 4 stats cards at the top (number of items, collections, favorite items, favorite collections)
  - [x] Recent collections
  - [x] Pinned items
  - [x] 10 recent items
  - [x] Collection cards have a proportional color strip on the left based on item type distribution
  - [x] Pinned and recent items have a left border in their item type color
  - [x] Dark/light mode toggler in top bar at right edge next to New Item (persists to localStorage)
  - [x] List/grid view switcher in top bar (affects pinned and recent items)
  - [x] Responsive top bar (search and New Collection hidden on mobile, New Item icon-only on small screens)
  - [x] FolderPlus icon on New Collection button
  - [x] Styled thin scrollbar on main content area matching sidebar scrollbar