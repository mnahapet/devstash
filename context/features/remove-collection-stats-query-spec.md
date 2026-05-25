# Remove Redundant getCollectionStats DB Query

## Overview

`getCollectionStats` fires two extra COUNT queries on every dashboard load for data already available in the `getCollections` result. Replace it with a pure in-memory `deriveCollectionStats` function, matching the pattern already used by `deriveItemStats` for items.

## Requirements

- Delete `getCollectionStats` from `src/lib/db/collections.ts`
- Add `deriveCollectionStats(collections: CollectionWithStats[]): CollectionStats` that computes `total` and `favorites` from the array
- Update `src/app/(dashboard)/dashboard/page.tsx` to call `deriveCollectionStats(collections)` instead of `getCollectionStats(userId)` in `Promise.all`
- `CollectionStats` type stays unchanged — `StatsCards` prop interface is unaffected

## Implementation Notes

- `deriveCollectionStats` is a plain synchronous function (no async, no Prisma)
- `favorites` count = `collections.filter(c => c.isFavorite).length`
- `total` count = `collections.length`
- Remove `getCollectionStats` import from dashboard page; add `deriveCollectionStats` import
- `Promise.all` drops from 4 concurrent queries to 3
