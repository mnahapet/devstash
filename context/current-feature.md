# Current feature

Dashboard card & carousel polish

## Status

Completed

## Goals

<!-- Goals & requirements -->

## Notes

<!-- Any extra notes -->

- Spec: @context/features/seed-spec.md
- Overwrite existing `prisma/seed.ts` with the full seed script
- Hash the demo user password with bcryptjs, 12 rounds
- Use real URLs for link items
- All system item types have `isSystem: true` and no `userId`
- Use `upsert` where possible to make the seed idempotent

## History

<!-- Keep this updated. Earliest to latest -->

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
  - [x] List/grid view switcher in top bar (affects collections, pinned, and recent items)
  - [x] Responsive top bar (search and New Collection hidden on mobile, New Item icon-only on small screens)
  - [x] FolderPlus icon on New Collection button
  - [x] Styled thin scrollbar on main content area matching sidebar scrollbar
- Sidebar collection folder icon colored by dominant item type
  - [x] Folder icons in "All Collections" sidebar section are colored with the dominant item type color (highest count in typeDistribution)
- Mobile UX improvements & scrollbar polish
  - [x] Mobile search bar expands inline in TopBar (replaces header content) with autoFocus, Escape to close, X close icon, theme toggle at right edge
  - [x] Logo and sidebar toggle remain visible when mobile search is open
  - [x] Mini sidebar (icons only, 48px) always visible on mobile < lg breakpoint with item type icons and user initials
  - [x] Mobile drawer starts below TopBar (top-14 offset) so TopBar is never covered
  - [x] Sidebar collapse animation scoped to transition-[width] to prevent TopBar flicker
  - [x] Scrollbars reworked: theme-aware rgba thumb colors (light/dark mode), 6px width, transparent track, consistent appearance across sidebar and main area
- Sidebar & favicon polish
  - [x] Desktop collapse toggler now collapses to mini sidebar (icons only, 48px) instead of fully hiding
  - [x] Mobile drawer width fixed to 240px (15rem) via inline style — Tailwind w-* was overridden by SheetContent's built-in data-[side=left]:w-3/4
  - [x] Sidebar hydration mismatch fixed: isCollapsed now always initializes as false on server, then reads localStorage in useEffect
  - [x] Favicon added as src/app/icon.tsx (Next.js App Router auto-detection) — black Layers icon, 32×32
- Sidebar toggle UX polish
  - [x] Toggle moved from TopBar into sidebar itself — `PanelLeftClose` (Lucide) in the full sidebar header, `PanelLeftOpen` (Lucide) in the mini sidebar, right-aligned in both cases
  - [x] Full sidebar header shows "Navigation" label + `PanelLeftClose` toggle; on desktop it collapses to mini, in the mobile drawer it closes the drawer
  - [x] Mini sidebar shows `PanelLeftOpen` toggle (right-aligned) only when the mobile drawer is closed; hidden when drawer is open to avoid duplicate toggles
  - [x] Mobile drawer starts at left:0, fully covering the mini sidebar so the header looks identical in desktop expanded and mobile expanded states
  - [x] `isMobileOpen` auto-closes when window resizes to ≥ lg (1024px) via MediaQueryList listener in SidebarProvider, preventing desktop/mobile overlap
  - [x] Mobile search close button uses `X` icon (Lucide)
- Prisma 7 + Neon PostgreSQL setup
  - [x] Install Prisma 7 and review upgrade guide for breaking changes
  - [x] Configure Neon PostgreSQL connection via DATABASE_URL
  - [x] Create `prisma/schema.prisma` with full schema (User, Item, ItemType, Collection, ItemCollection, Tag)
  - [x] Include NextAuth models (Account, Session, VerificationToken)
  - [x] Add appropriate indexes and cascade deletes
  - [x] Create initial migration with `prisma migrate dev`
  - [x] Create `prisma/seed.ts` to seed system item types
  - [x] Verify migration runs cleanly against development Neon branch
- Seed data
  - [x] Demo user: demo@devstash.io, password hashed with bcryptjs (12 rounds)
  - [x] 7 system item types seeded (snippet, prompt, command, note, file, image, link)
  - [x] React Patterns collection with 3 TypeScript snippets
  - [x] AI Workflows collection with 3 prompts
  - [x] DevOps collection with 1 snippet, 1 command, 2 links
  - [x] Terminal Commands collection with 4 commands
  - [x] Design Resources collection with 4 links
  - [x] Seed runs cleanly via `npm run db:seed`
- Sidebar navigation restructure
  - [x] Separator line added between Types and Collections sections
  - [x] COLLECTIONS section replaced with FAVORITES section showing 3 most recent favorite collections (pink Heart icon) and 3 most recent favorite items (yellow Star icon)
  - [x] COLLECTIONS section added below FAVORITES showing all collections sorted newest first (folder icon colored by dominant item type + item count)
  - [x] Favorite Collections stat card icon changed from BookMarked to Heart (pink, with pink-tinted background)
  - [x] COLLECTIONS section replaced with RECENT section showing 3 most recently updated collections (folder icon) and 3 most recently updated items (type icon), newest first
  - [x] PINNED section added above TYPES showing 1 most recently updated pinned collection and 1 most recently updated pinned item (both with filled white Pin icon)
  - [x] Added isPinned field to mock collections data
  - [x] Dashboard Pinned section moved before Collections, shows all pinned collections then items as horizontal carousel
  - [x] Carousel has left/right arrow buttons, dot indicators, and active card highlighted with white ring on all sides
  - [x] Pinned carousel uses shadcn Carousel (Embla) with custom arrow buttons in header and dot indicators; active card highlighted with ring-1 ring-white/50
- Dashboard card & carousel polish
  - [x] Favorites carousel added to main dashboard area (between Pinned and Collections), showing all favorite collections then items, with filled pink Heart icon before "FAVORITES" title
  - [x] Collection cards (all sections): colored FolderOpen icon in top-left (dominant item type color), status icons grouped in top-right, title below, item count below title, description below count
  - [x] Item cards (all sections): small tinted type icon in top-left (h-5 w-5), status icons grouped in top-right, title below, description below with mt-2 spacing
  - [x] Status icons shown for both collections and items: Heart (pink, filled) + Star (yellow, filled) if isFavorite; Pin (white, filled) if isPinned
  - [x] Favorites carousel cards omit Heart icon (redundant in that section); Pinned carousel cards omit Pin icon
  - [x] MoreHorizontal (…) menu button removed from all collection cards across all sections
  - [x] Collections section renamed from "Recent Collections" to "Collections"; shows all collections sorted by updatedAt descending (no slice limit)
  - [x] Items section renamed from "Recent Items" to "Items" with Clock icon removed; shows all items sorted by updatedAt descending (no slice limit)
  - [x] Collections list row restructured to match item row: FolderOpen icon left, name + Heart/Star/Pin inline, description below, item count below description
  - [x] Item list rows: Heart + Star + Pin shown inline next to title; description spacing increased to mt-1.5
  - [x] ItemCard grid: icon reduced to h-5 w-5, description spacing mt-1 → mt-2
  - [x] ItemRow description spacing mt-0.5 → mt-1.5