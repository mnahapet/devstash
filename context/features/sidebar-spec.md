# Sidebar Real Data Spec

## Overview

Replace all remaining mock data in the sidebar with actual data from the Neon database. The sidebar currently uses `mockItemTypes`, `mockItemTypeCounts`, `mockCollections`, `mockItems`, and `mockUser` from `@src/lib/mock-data.ts`. All of this should come from the DB.

The UI should not change — only the data source.

## Requirements

- Create `src/lib/db/item-types.ts` with a `getItemTypesWithCounts(userId)` function that returns all system item types with a per-type item count for the current user
- Fetch item types in the dashboard page alongside existing queries (use `Promise.all`)
- Derive all sidebar subsets from already-fetched `collections` and `items` arrays — no extra DB queries
- Pass all sidebar data as props to the `Sidebar` component:
  - `user` — name and email from the DB user record
  - `itemTypes` — all system types with counts (Types section + mini sidebar icons)
  - `pinnedCollections` — top 1 pinned collection (Pinned section)
  - `pinnedItems` — top 1 pinned item (Pinned section)
  - `favoriteCollections` — top 3 favorite collections (Favorites section)
  - `favoriteItems` — top 3 favorite items (Favorites section)
  - `recentCollections` — top 3 most recently updated collections (Recent section)
  - `recentItems` — top 3 most recently updated items (Recent section)
- Remove all imports from `@/lib/mock-data` in `Sidebar.tsx`
- `getDominantTypeColor` should read `color` directly from `typeDistribution` (no mock type lookup)

## References

Check the `@context/screenshots/dashboard-ui-drawer.png` screenshot if needed, but layout and design is already there.
