# Auth Flow

DevStash uses **NextAuth v5** with two providers: GitHub OAuth and email/password (Credentials).

## Key Files

| File | Role |
|------|------|
| `src/auth.config.ts` | Edge-safe config — providers declared, custom pages set |
| `src/auth.ts` | Full server config — Prisma adapter, JWT strategy, `authorize`, session callback |
| `src/proxy.ts` | Middleware — protects `/dashboard/*` routes, redirects to `/sign-in` |
| `src/app/(auth)/sign-in/page.tsx` | Custom sign-in UI |
| `src/app/(auth)/register/page.tsx` | Registration UI |
| `src/app/api/auth/register/route.ts` | `POST /api/auth/register` — creates new users |
| `src/app/api/auth/[...nextauth]/route.ts` | NextAuth catch-all handler |

---

## Sign-In Flow (Credentials)

```
Browser                     Next.js                         DB
  │                            │                             │
  │  POST /sign-in (form)       │                             │
  │──────────────────────────► │                             │
  │                            │  signIn('credentials', ...) │
  │                            │  → /api/auth/callback/      │
  │                            │    credentials              │
  │                            │                             │
  │                            │  authorize(email, password) │
  │                            │──────────────────────────► │
  │                            │  ◄── user row (or null)     │
  │                            │                             │
  │                            │  bcrypt.compare(pw, hash)   │
  │                            │  return { id, name, email,  │
  │                            │           image }           │
  │                            │                             │
  │                            │  JWT created                │
  │                            │  token.sub = user.id        │
  │                            │                             │
  │  ◄── Set-Cookie: session   │                             │
  │  redirect → /dashboard     │                             │
```

## Sign-In Flow (GitHub OAuth)

```
Browser                     Next.js                   GitHub            DB
  │                            │                          │               │
  │  signIn('github')          │                          │               │
  │──────────────────────────► │                          │               │
  │  ◄── redirect to GitHub    │                          │               │
  │                            │                          │               │
  │  OAuth consent ────────────────────────────────────► │               │
  │  ◄── callback with code    │                          │               │
  │                            │  exchange code for token │               │
  │                            │ ◄──────────────────────  │               │
  │                            │  fetch GitHub profile    │               │
  │                            │  Prisma adapter upserts  │               │
  │                            │  user + account ────────────────────── ► │
  │                            │  token.sub = user.id     │               │
  │                            │                          │               │
  │  ◄── Set-Cookie: session   │                          │               │
  │  redirect → /dashboard     │                          │               │
```

---

## Session Structure

The JWT cookie holds a minimal token. The session callback in `auth.ts` copies the user's DB id from `token.sub` onto `session.user`:

```ts
// src/auth.ts
callbacks: {
  session({ session, token }) {
    if (token.sub && session.user) {
      session.user.id = token.sub   // DB user id, set for both providers
    }
    return session
  },
}
```

On the server, `await auth()` decodes the cookie and returns this session — no DB query.

---

## Route Protection

`src/proxy.ts` runs as Next.js middleware on every request matching `/dashboard/:path*`:

```ts
if (pathname.startsWith('/dashboard') && !isLoggedIn) {
  redirect to /sign-in?callbackUrl=<original url>
}
```

After sign-in, NextAuth redirects back to `callbackUrl`.

---

## How Dashboard Pages Get the User

**`(dashboard)/layout.tsx`** — fetches the full DB record for display:
```ts
const session = await auth();
if (!session?.user?.id) redirect('/sign-in');

const user = await getUserById(session.user.id);   // name, email, image for sidebar
const sidebarData = await getSidebarData(session.user.id);
```

**`(dashboard)/dashboard/page.tsx`** — only needs the id to pass to data-fetching sections:
```ts
const session = await auth();
if (!session?.user?.id) redirect('/sign-in');

const user = { id: session.user.id };  // id only — no extra DB query
```

---

## Registration

`POST /api/auth/register` (`src/app/api/auth/register/route.ts`):

1. Validates all fields — name, email, password, confirmPassword
2. Checks password length ≥ 8 and passwords match
3. Checks for duplicate email (`prisma.user.findUnique`)
4. Hashes password with bcrypt (12 rounds)
5. Creates user (`prisma.user.create`)
6. Returns `{ success: true }`

After the API responds with `201`, the register page **automatically signs the user in** using the credentials they just submitted — no manual sign-in step required:

```ts
if (res.ok) {
  await signIn('credentials', { email, password, callbackUrl: '/dashboard' });
}
```

This calls the same `authorize` flow as a normal sign-in, creates the JWT session cookie, and redirects straight to `/dashboard`.

---

## Two Config Files

NextAuth v5 requires splitting config for edge compatibility:

- **`auth.config.ts`** — imported by `proxy.ts` (runs on the edge). Cannot use Prisma or bcrypt here.
- **`auth.ts`** — imports `auth.config.ts` and adds the Prisma adapter + real `authorize` logic. Only runs in Node.js (API routes, server components).
