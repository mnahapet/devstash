# Current Feature: Forgot Password

## Status

In Progress

## Goals

- Add "Forgot password?" link on the sign-in page
- `/forgot-password` page — user enters email, receives a reset link via Resend
- `/reset-password?token=xxx` page — user enters new password + confirm, token validated, password updated
- Reuse existing `VerificationToken` model — no schema migration needed
- Always return success from the forgot-password API to avoid email enumeration

## Notes

### Token strategy — no migration needed

Reuse `VerificationToken` with a namespaced `identifier`:
- Email verification tokens: `identifier = email`
- Password reset tokens: `identifier = "reset:" + email`

This keeps both token types in one table without any schema change. Reset token validation checks `identifier.startsWith('reset:')` as a safety guard.

### API routes

**`POST /api/auth/forgot-password`** (`src/app/api/auth/forgot-password/route.ts`):
- Look up user by email
- If not found or is OAuth-only (no password): still return `{ success: true }` — no enumeration
- Delete existing reset tokens: `deleteMany({ where: { identifier: 'reset:' + email } })`
- Generate 32-byte hex token, store with `identifier: 'reset:' + email`, `expires: +1hr`
- `sendPasswordResetEmail(email, token, baseUrl)` via Resend
- Return `{ success: true }` always

**`POST /api/auth/reset-password`** (`src/app/api/auth/reset-password/route.ts`):
- Accept `{ token, password, confirmPassword }`
- Validate password length ≥ 8 and passwords match
- Look up token in `VerificationToken`
- Guard: token not found → 400; identifier doesn't start with `"reset:"` → 400; expired → delete + 400
- Hash new password with bcrypt (12 rounds), update `user.password` where `email = identifier.slice(6)`
- Delete token
- Return `{ success: true }`

### Pages

**`src/app/(auth)/forgot-password/page.tsx`** (client component):
- Email input + submit button
- On success: show "If that email is registered, a reset link is on its way." (no redirect, stays on page)
- On error: show error message

**`src/app/(auth)/reset-password/page.tsx`** (client component):
- Reads `?token=` from `useSearchParams()`
- New password + confirm password inputs
- On success: `router.push('/sign-in')` (no auto sign-in — fresh sign-in after reset is cleaner)
- On error: show inline error (invalid token, expired, etc.)

### Email

Add `sendPasswordResetEmail(to, token, baseUrl)` to `src/lib/email.ts`:
- Link: `${baseUrl}/reset-password?token=${token}`
- Same dark/light theme as verification email
- Subject: "Reset your DevStash password"

### Sign-in page

Add "Forgot password?" link below the password field, linking to `/forgot-password`.

## History

- Email Verification Toggle
  - [x] `src/app/api/auth/register/route.ts` — when `SKIP_EMAIL_VERIFICATION=true`, creates user with `emailVerified: new Date()` and returns `emailVerificationRequired: false`; otherwise existing flow with `emailVerificationRequired: true`
  - [x] `src/app/(auth)/register/page.tsx` — branches on `emailVerificationRequired`: `false` → `/sign-in`, `true` → `/check-your-email?email=...`
  - [x] `src/auth.ts` — `authorize` skips `!user.emailVerified` guard when flag is set

- Email Verification
  - [x] `src/lib/email.ts` — Resend client + `sendVerificationEmail(to, token, baseUrl)`
  - [x] `src/app/api/auth/register/route.ts` — generates token, stores in `VerificationToken`, sends email; rolls back user + token on email failure
  - [x] `src/app/api/auth/resend-verification/route.ts` — POST: deletes old token, issues new one, resends email; always returns `{ success: true }` to avoid email enumeration
  - [x] `src/app/(auth)/register/page.tsx` — redirects to `/check-your-email?email=...` on success (removed auto sign-in)
  - [x] `src/app/(auth)/check-your-email/page.tsx` — info page showing email address + `ResendVerificationButton`
  - [x] `src/app/(auth)/verify-email/page.tsx` — validates token, renders "Email Verified!" success UI or error UI inline
  - [x] `src/components/auth/ResendVerificationButton.tsx` — client component: calls resend API, shows sent/error feedback
  - [x] `src/auth.ts` — `authorize` blocks sign-in if `!user.emailVerified`
  - [x] `docs/resend.md` — Resend setup, from address, free tier, adding new email types
  - [x] `docs/auth-flow.md` — updated with full email verification flow diagram and key files
  - [x] `context/features/email-verification-spec.md` — full spec: flow, key files, env vars, error states, constraints, testing

- Auth UI - Sign In, Register & Sign Out
  - [x] `src/auth.config.ts` — `pages: { signIn: '/sign-in' }` added so NextAuth uses custom page
  - [x] `src/proxy.ts` — redirect updated from `/api/auth/signin` to `/sign-in`
  - [x] `src/app/(auth)/layout.tsx` — centered auth layout (no sidebar)
  - [x] `src/app/(auth)/sign-in/page.tsx` — email/password form + GitHub OAuth button + link to register; `useSearchParams` wrapped in `<Suspense>`
  - [x] `src/app/(auth)/register/page.tsx` — name/email/password/confirm form with client-side validation; auto-signs in after successful registration via `signIn('credentials', ...)`
  - [x] `src/components/auth/UserAvatar.tsx` — reusable avatar: renders GitHub image (`next/image`) or initials fallback
  - [x] `src/components/layout/Sidebar.tsx` — user area replaced with `UserAvatar` + `DropdownMenu` (Profile → `/profile`, Sign out → `signOut`)
  - [x] `src/types/sidebar.ts` — `SidebarUser` extended with `image?: string | null`
  - [x] `src/app/(dashboard)/layout.tsx` — replaced hardcoded `demo@devstash.io` with `auth()` session; fetches real user via `getUserById(session.user.id)`
  - [x] `src/app/(dashboard)/dashboard/page.tsx` — replaced hardcoded email lookup with `auth()` session
  - [x] `next.config.ts` — `avatars.githubusercontent.com` added to `images.remotePatterns` for GitHub avatars
  - [x] `shadcn` `dropdown-menu` and `label` components installed
  - [x] `docs/auth-flow.md` created — documents full sign-in, GitHub OAuth, registration, and auto-login flows

- Auth Credentials - Email/Password Provider
  - [x] `src/auth.config.ts` — added Credentials placeholder with `email`/`password` field definitions (edge-safe, `authorize: () => null`)
  - [x] `src/auth.ts` — overrides Credentials (filters placeholder by id) with real `authorize`: bcrypt hash compare, returns `{ id, name, email, image }`
  - [x] `src/app/api/auth/register/route.ts` — `POST /api/auth/register`; validates all fields, passwords match, min 8 chars, no duplicate email (409), bcrypt hash (12 rounds), creates user
  - [x] Sign-in page shows Email + Password fields alongside GitHub button — verified in browser
  - [x] Email/password sign-in → dashboard access confirmed via Playwright

- Auth Setup - NextAuth v5 + GitHub Provider
  - [x] Installed `next-auth@beta` and `@auth/prisma-adapter`
  - [x] `src/auth.config.ts` — edge-compatible config (GitHub provider only, no Prisma adapter)
  - [x] `src/auth.ts` — full config with Prisma adapter, JWT strategy, session callback adds `user.id` from token
  - [x] `src/app/api/auth/[...nextauth]/route.ts` — exports `GET`/`POST` handlers
  - [x] `src/proxy.ts` — Next.js 16 proxy (replaces `middleware.ts`); redirects unauthenticated `/dashboard/*` requests to `/api/auth/signin?callbackUrl=…`
  - [x] `src/types/next-auth.d.ts` — extends `Session` with `user.id: string`
  - [x] Verified: visiting `/dashboard` unauthenticated redirects to NextAuth default sign-in page with "Sign in with GitHub" button

- Hydration mismatch fix
  - [x] `suppressHydrationWarning` added to `<body>` in `layout.tsx` — browser extensions (e.g. ColorZilla) inject `cz-shortcut-listen="true"` onto `<body>` before React hydrates, causing a server/client attribute mismatch

- Server-side pagination with per-section streaming and error boundaries
  - [x] `getCollections` and `getItems` paginated with `skip`/`take`; no more full table scans
  - [x] `getCollectionStats` / `getItemStats` added — two `COUNT` queries each; `deriveCollectionStats` / `deriveItemStats` removed
  - [x] `getPinnedCollections`, `getFavoriteCollections`, `getRecentCollections` added with `take` limits; same for items
  - [x] Pagination state moved to URL searchParams (`?collectionsPage=` / `?itemsPage=`) via `<Link>` navigation in `Collections.tsx` and `Items.tsx`
  - [x] Dashboard split into 6 async server section components in `src/components/dashboard/sections/`
  - [x] Each section wrapped in `<SectionErrorBoundary><Suspense fallback={skeleton}>` — sections stream independently, failures degrade inline
  - [x] `SectionErrorBoundary` recreated as class + functional wrapper; Retry calls `router.refresh()` to re-fetch server data
  - [x] `page.tsx` reduced to auth + searchParams parsing + section composition only

- Accessibility & theme flash fixes
  - [x] Carousel `useEffect` listener leak fixed in `PinnedItems.tsx`, `FavoriteItems.tsx`, `RecentCarousel.tsx`
  - [x] Theme flash on load fixed in `layout.tsx`

- UI & type fixes
- Bug fixes & DB index hardening
- next.js cleanup and tailwind setup
- Dashboard UI Phases 1–3
- Sidebar navigation restructure & polish (multiple rounds)
- Prisma 7 + Neon PostgreSQL setup
- Seed data (initial + expanded)
- Dashboard real data (collections, items, sidebar)
- Dashboard loading state & UX polish
- Code quality & security review fixes

- Email Verification Toggle
  - [x] `src/app/api/auth/register/route.ts` — when `SKIP_EMAIL_VERIFICATION=true`, creates user with `emailVerified: new Date()` and returns `emailVerificationRequired: false`; otherwise existing flow with `emailVerificationRequired: true`
  - [x] `src/app/(auth)/register/page.tsx` — branches on `emailVerificationRequired`: `false` → `/sign-in`, `true` → `/check-your-email?email=...`
  - [x] `src/auth.ts` — `authorize` skips `!user.emailVerified` guard when flag is set

- Email Verification
  - [x] `src/lib/email.ts` — Resend client + `sendVerificationEmail(to, token, baseUrl)`
  - [x] `src/app/api/auth/register/route.ts` — generates token, stores in `VerificationToken`, sends email; rolls back user + token on email failure
  - [x] `src/app/api/auth/resend-verification/route.ts` — POST: deletes old token, issues new one, resends email; always returns `{ success: true }` to avoid email enumeration
  - [x] `src/app/(auth)/register/page.tsx` — redirects to `/check-your-email?email=...` on success (removed auto sign-in)
  - [x] `src/app/(auth)/check-your-email/page.tsx` — info page showing email address + `ResendVerificationButton`
  - [x] `src/app/(auth)/verify-email/page.tsx` — validates token, renders "Email Verified!" success UI or error UI inline
  - [x] `src/components/auth/ResendVerificationButton.tsx` — client component: calls resend API, shows sent/error feedback
  - [x] `src/auth.ts` — `authorize` blocks sign-in if `!user.emailVerified`
  - [x] `docs/resend.md` — Resend setup, from address, free tier, adding new email types
  - [x] `docs/auth-flow.md` — updated with full email verification flow diagram and key files
  - [x] `context/features/email-verification-spec.md` — full spec: flow, key files, env vars, error states, constraints, testing

- Auth UI - Sign In, Register & Sign Out
  - [x] `src/auth.config.ts` — `pages: { signIn: '/sign-in' }` added so NextAuth uses custom page
  - [x] `src/proxy.ts` — redirect updated from `/api/auth/signin` to `/sign-in`
  - [x] `src/app/(auth)/layout.tsx` — centered auth layout (no sidebar)
  - [x] `src/app/(auth)/sign-in/page.tsx` — email/password form + GitHub OAuth button + link to register; `useSearchParams` wrapped in `<Suspense>`
  - [x] `src/app/(auth)/register/page.tsx` — name/email/password/confirm form with client-side validation; auto-signs in after successful registration via `signIn('credentials', ...)`
  - [x] `src/components/auth/UserAvatar.tsx` — reusable avatar: renders GitHub image (`next/image`) or initials fallback
  - [x] `src/components/layout/Sidebar.tsx` — user area replaced with `UserAvatar` + `DropdownMenu` (Profile → `/profile`, Sign out → `signOut`)
  - [x] `src/types/sidebar.ts` — `SidebarUser` extended with `image?: string | null`
  - [x] `src/app/(dashboard)/layout.tsx` — replaced hardcoded `demo@devstash.io` with `auth()` session; fetches real user via `getUserById(session.user.id)`
  - [x] `src/app/(dashboard)/dashboard/page.tsx` — replaced hardcoded email lookup with `auth()` session
  - [x] `next.config.ts` — `avatars.githubusercontent.com` added to `images.remotePatterns` for GitHub avatars
  - [x] `shadcn` `dropdown-menu` and `label` components installed
  - [x] `docs/auth-flow.md` created — documents full sign-in, GitHub OAuth, registration, and auto-login flows

- Auth Credentials - Email/Password Provider
  - [x] `src/auth.config.ts` — added Credentials placeholder with `email`/`password` field definitions (edge-safe, `authorize: () => null`)
  - [x] `src/auth.ts` — overrides Credentials (filters placeholder by id) with real `authorize`: bcrypt hash compare, returns `{ id, name, email, image }`
  - [x] `src/app/api/auth/register/route.ts` — `POST /api/auth/register`; validates all fields, passwords match, min 8 chars, no duplicate email (409), bcrypt hash (12 rounds), creates user
  - [x] Sign-in page shows Email + Password fields alongside GitHub button — verified in browser
  - [x] Email/password sign-in → dashboard access confirmed via Playwright

- Auth Setup - NextAuth v5 + GitHub Provider
  - [x] Installed `next-auth@beta` and `@auth/prisma-adapter`
  - [x] `src/auth.config.ts` — edge-compatible config (GitHub provider only, no Prisma adapter)
  - [x] `src/auth.ts` — full config with Prisma adapter, JWT strategy, session callback adds `user.id` from token
  - [x] `src/app/api/auth/[...nextauth]/route.ts` — exports `GET`/`POST` handlers
  - [x] `src/proxy.ts` — Next.js 16 proxy (replaces `middleware.ts`); redirects unauthenticated `/dashboard/*` requests to `/api/auth/signin?callbackUrl=…`
  - [x] `src/types/next-auth.d.ts` — extends `Session` with `user.id: string`
  - [x] Verified: visiting `/dashboard` unauthenticated redirects to NextAuth default sign-in page with "Sign in with GitHub" button

- Hydration mismatch fix
  - [x] `suppressHydrationWarning` added to `<body>` in `layout.tsx` — browser extensions (e.g. ColorZilla) inject `cz-shortcut-listen="true"` onto `<body>` before React hydrates, causing a server/client attribute mismatch

- Server-side pagination with per-section streaming and error boundaries
  - [x] `getCollections` and `getItems` paginated with `skip`/`take`; no more full table scans
  - [x] `getCollectionStats` / `getItemStats` added — two `COUNT` queries each; `deriveCollectionStats` / `deriveItemStats` removed
  - [x] `getPinnedCollections`, `getFavoriteCollections`, `getRecentCollections` added with `take` limits; same for items
  - [x] Pagination state moved to URL searchParams (`?collectionsPage=` / `?itemsPage=`) via `<Link>` navigation in `Collections.tsx` and `Items.tsx`
  - [x] Dashboard split into 6 async server section components in `src/components/dashboard/sections/`
  - [x] Each section wrapped in `<SectionErrorBoundary><Suspense fallback={skeleton}>` — sections stream independently, failures degrade inline
  - [x] `SectionErrorBoundary` recreated as class + functional wrapper; Retry calls `router.refresh()` to re-fetch server data
  - [x] `page.tsx` reduced to auth + searchParams parsing + section composition only



- Accessibility & theme flash fixes
  - [x] Carousel `useEffect` listener leak fixed in `PinnedItems.tsx`, `FavoriteItems.tsx`, `RecentCarousel.tsx` — added `return () => { api.off('select', update); api.off('reInit', update); }` cleanup to prevent stacking listeners on re-render
  - [x] `SectionErrorBoundary` removed from `dashboard/page.tsx` — boundaries couldn't catch errors from `Promise.all` above them; page-level `error.tsx` is the correct handler
  - [x] All five dashboard `<section>` elements given `aria-labelledby` pointing to their `<h2>` `id` — `Collections.tsx`, `Items.tsx`, `PinnedItems.tsx`, `FavoriteItems.tsx`, `RecentCarousel.tsx`
  - [x] Settings button in `Sidebar.tsx` given `aria-label='Settings'`
  - [x] Four sidebar collapsible buttons given `aria-expanded` — Pinned, Types, Collections, Items sections in `Sidebar.tsx`
  - [x] Carousel nav buttons given context-specific `aria-label` values — "Previous/Next pinned item", "Previous/Next favorite", "Previous/Next recent item"
  - [x] Theme flash on load fixed in `layout.tsx` — removed static `dark` class from `<html>`; added blocking inline `<script>` in `<head>` that reads `localStorage` before paint and toggles `dark` class (defaults to dark)

- UI & type fixes
  - [x] Active carousel ring changed from `ring-white/50` to `ring-foreground/20` in `PinnedItems.tsx`, `FavoriteItems.tsx`, `RecentCarousel.tsx` — was invisible in light mode
  - [x] `getUserInitials` in `Sidebar.tsx` fixed: `.split(' ')` → `.trim().split(/\s+/).filter(Boolean)` — prevents `undefined[0]` on names with leading/trailing or multiple spaces
  - [x] Local `interface Item` removed from `ItemCard.tsx` and `ItemRow.tsx`; both now import `ItemWithType` from `@/lib/db/items` — eliminates type duplication and drift risk

- Bug fixes & DB index hardening
  - [x] `layout.tsx` refactored to call `getSidebarData(userId)` (6 targeted lean queries with TAKE limits) instead of full `getCollections`/`getItems` — eliminates overlap with `page.tsx` and removes reliance on `cache()` deduplication across layout/page boundary
  - [x] `src/lib/db/sidebar.ts` created: `getSidebarData` fetches only the fields/rows the sidebar needs, returns typed `SidebarData` object
  - [x] Pin icon in Sidebar PINNED section fixed: `fill-white text-white` → `fill-foreground text-foreground` so it is visible in light mode
  - [x] `JSON.parse` in `sidebar-context.tsx` wrapped in `try/catch` that clears the corrupt key — prevents a bad localStorage value from crashing the entire sidebar provider
  - [x] `DATABASE_URL!` non-null assertion in `prisma.ts` replaced with explicit guard that throws a clear startup error message
  - [x] `loading.tsx` missing third `<CarouselSkeleton />` added (matches `RecentCarousel` at bottom of dashboard page) — fixes layout shift on load
  - [x] `@@index([collectionId])` added to `ItemCollection` join table in `schema.prisma`; migration `20260526171130_add_item_collections_collection_id_index` created and applied

<!-- Keep this updated. Earliest to latest -->

- next.js cleanup and tailwind setup
- Dashboard UI Phase 1: ShadCN setup, dashboard route, top bar with centered search, logo icon, dark mode, sidebar/main placeholders
- Dashboard UI Phase 2: Collapsible sidebar with navigation, collections, and user avatar
- Dashboard UI Phase 3: Main area with stats cards, recent collections, pinned items, and recent items
- Sidebar collection folder icon colored by dominant item type
- Mobile UX improvements & scrollbar polish
- Sidebar & favicon polish
- Sidebar toggle UX polish
- Prisma 7 + Neon PostgreSQL setup
- Seed data
- Sidebar navigation restructure
- Dashboard card & carousel polish
- Dashboard card layout refinements
- Dashboard further refinements
- Dashboard stats cards polish
- Mini sidebar restructure
- Dashboard pagination & mock data expansion
- Expanded seed data (11 collections, 36 items)
- Dashboard Collections — Real Data
- Collection card status icons — real data
- Sidebar favorite collections — real data
- Dashboard Items — Real Data
- Sidebar — Real Data
- Dashboard loading state & UX polish
- Sidebar navigation refactor
- Add Pro Badge to Sidebar
- Remove redundant getCollectionStats DB query
- Extract shared carousel cards
- Move user DB lookup out of dashboard page
- Carousel code quality fixes
- Mini sidebar enhanced navigation
- Sidebar layout restructure & toggle fix
- Next.js loading & error boundaries
- Hydration mismatch fix
- Code quality & polish fixes
- Code quality & security review fixes
