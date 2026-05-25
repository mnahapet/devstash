# Extract Shared Carousel Cards

## Overview

Eliminate copy-pasted `CollectionCard`, `ItemCard`, `ICON_MAP`, `getDominantTypeColor`, and `buildGradient` across `PinnedItems`, `FavoriteItems`, and `RecentCarousel` by extracting them into a single shared module.

## Requirements

- Create `src/components/dashboard/shared/carousel-cards.tsx` exporting `CollectionCarouselCard`, `ItemCarouselCard`, `ICON_MAP`, `getDominantTypeColor`, and `buildGradient`
- `CollectionCarouselCard` accepts `showHeart?` and `showPin?` props (both default `true`) to suppress redundant status icons per section
- `ItemCarouselCard` accepts the same `showHeart?` and `showPin?` props with the same defaults
- `PinnedItems` passes `showPin={false}` — pin icon is redundant in the pinned section
- `FavoriteItems` passes `showHeart={false}` — heart is redundant in the favorites section
- `RecentCarousel` uses all defaults — shows every status icon
- All three carousel files import from the shared module; no local copies of the extracted code remain
- Build passes with no type errors

## Implementation Notes

- `showHeart` on `CollectionCarouselCard` gates `col.isFavorite`; on `ItemCarouselCard` it gates `item.inFavoriteCollection`
- Star (`hasFavoriteItem` / `isFavorite`) is always shown in both cards — it is never contextually redundant
- The shared file has no `'use client'` directive; the three carousel files remain `'use client'` since they own the Embla carousel state
