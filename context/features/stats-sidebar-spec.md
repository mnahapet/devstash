# Stats & Sidebar Spec

## Overview

Show the stats in the main area from the data in the database instead of the @src/lib/mock-data.ts file.

Show the system item types in the sidebar and the actual collection and item data from the database.

## Requirements

- Display stats pertaining to database data, keeping the current design/layout
- Display item types in sidebar with their icons, linking to `/items/[typename]` (singular, e.g. `/items/snippet`); labels shown in plural form (e.g. "Snippets")
- Expanded sidebar has a **COLLECTIONS** group with two subgroups:
  - **Recent** — colored circle per row based on dominant item type color; sorted by `updatedAt` desc
  - **Favorites** — filled pink Heart icon per row; sorted by `updatedAt` desc
  - "View all" link at the bottom going to `/collections`
- Expanded sidebar has an **ITEMS** group with two subgroups:
  - **Recent** — colored circle per row based on item type color; sorted by `updatedAt` desc
  - **Favorites** — filled yellow Star icon per row; sorted by `updatedAt` desc
  - "View all" link at the bottom going to `/items`
- **PINNED** group shows most recently updated pinned collection and pinned item, each with a filled white Pin icon; sorted by `updatedAt` desc
- All sidebar data derived from already-fetched arrays in the dashboard page — no extra DB queries
- Dashboard loading state: `loading.tsx` shows a colorful conic-gradient ring spinner (all 7 type colors) centered over pulsing skeleton content (sidebar + main area sections)
- View mode (list/grid) persisted to `localStorage` under key `devstash:viewMode`


## References

- @src/lib/db/collections.ts
- @src/lib/db/items.ts
- @src/lib/db/item-types.ts
