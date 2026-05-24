# Current feature

<!-- Feature Name -->

Seed Data - Populate the database with a demo user, system item types, and sample collections and items for development and demos.

## Status

<!-- Not Started|In Progress|Completed -->

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