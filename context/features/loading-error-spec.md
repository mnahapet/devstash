# Loading & Error Boundaries

## Overview

Uses Next.js App Router conventions (`loading.tsx`, `error.tsx`, and React Suspense) to provide per-section skeleton loading and isolated error recovery on the dashboard.

## Requirements

- `loading.tsx` at `(dashboard)/dashboard/` shows a full-page skeleton with spinner during initial route navigation
- `error.tsx` at `(dashboard)/dashboard/` catches page-level errors with a centered error UI and "Try again" reset button
- `error.tsx` at `(dashboard)/` catches layout-level errors (sidebar data, auth) with a full-screen error UI and reset button
- Both `error.tsx` files are Client Components, log the error, and display `error.digest` when present
- Dashboard page renders its heading immediately without waiting for data (shell-first pattern)
- Each dashboard section (`StatsCards`, `PinnedItems`, `FavoriteItems`, `Collections`, `Items`, `RecentCarousel`) is an async server component wrapped in `<Suspense>` with a matching skeleton fallback
- Each `<Suspense>` boundary is wrapped in `<SectionErrorBoundary>` so a single failing section shows an inline error strip without breaking the rest of the page
- `SectionErrorBoundary` is a React class component (`'use client'`) with a Retry button that resets its own state
- Skeleton components are defined in `skeletons.tsx` and imported by both `loading.tsx` and `page.tsx`

## Implementation Notes

- All DB functions (`getCollections`, `getItems`, `getUserByEmail`) are wrapped with React `cache()`, so multiple async section components that call the same function share one underlying DB round-trip per request
- Because the layout already resolves these cached queries before the page renders, section Suspense boundaries resolve near-instantly on warm requests; the streaming benefit is most visible on cold starts or future sections with independent data sources
- `SectionErrorBoundary` uses `getDerivedStateFromError` + `componentDidCatch` for logging; the Retry button calls `this.setState({ hasError: false })` to re-render children

## References

- [skeletons.tsx](../../src/app/(dashboard)/dashboard/skeletons.tsx)
- [loading.tsx](../../src/app/(dashboard)/dashboard/loading.tsx)
- [error.tsx — page level](../../src/app/(dashboard)/dashboard/error.tsx)
- [error.tsx — layout level](../../src/app/(dashboard)/error.tsx)
- [SectionErrorBoundary.tsx](../../src/components/dashboard/SectionErrorBoundary.tsx)
- [page.tsx](../../src/app/(dashboard)/dashboard/page.tsx)
