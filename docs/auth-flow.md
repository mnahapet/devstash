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

After the API responds with `201`, the register page redirects to `/check-your-email?email=xxx`. See **Email Verification Flow** below for the full token + email pipeline.

---

## Email Verification Flow

```
POST /api/auth/register
  → create user (emailVerified: null)
  → generate crypto token (32 bytes hex)
  → store in VerificationToken (expires: +1 hour)
  → send email via Resend with link: /api/auth/verify-email?token=xxx
  → 201 → register page redirects to /check-your-email?email=xxx

User clicks link in email
  → GET /api/auth/verify-email?token=xxx
  → token missing        → redirect /verify-email?error=invalid
  → token not in DB      → redirect /verify-email?error=invalid
  → token expired        → delete token, redirect /verify-email?error=expired
  → token valid          → set user.emailVerified, delete token
                         → redirect /sign-in?verified=true

/sign-in?verified=true
  → shows "Email verified — sign in to continue." banner
  → user signs in normally → /dashboard

User on /check-your-email clicks "Resend verification email"
  → POST /api/auth/resend-verification { email }
  → delete existing tokens for email
  → generate new token (expires: +1 hour)
  → send new email
  → returns { success: true } (always, to avoid email enumeration)
```

### Email verification key files

| File | Role |
|------|------|
| `src/lib/email.ts` | Resend client + `sendVerificationEmail(to, token)` |
| `src/app/api/auth/register/route.ts` | Creates user, token, sends email; rolls back on email failure |
| `src/app/api/auth/verify-email/route.ts` | GET — validates token, sets `emailVerified`, redirects |
| `src/app/api/auth/resend-verification/route.ts` | POST — deletes old token, issues new one, resends email |
| `src/app/(auth)/check-your-email/page.tsx` | Info page with email address + Resend button |
| `src/app/(auth)/verify-email/page.tsx` | Error-only page — renders `?error=invalid` / `?error=expired` |
| `src/components/auth/ResendVerificationButton.tsx` | Client component — calls resend API, shows feedback |
| `src/auth.ts` | `authorize`: returns null if `!user.emailVerified` |
| `src/app/(auth)/sign-in/page.tsx` | Shows verified banner on `?verified=true` |

---

## Post-Registration Approaches

There are several approaches for what happens next:

### Post-Registration Approaches

**1. Auto sign-in (previous approach)**

Call `signIn('credentials', ...)` immediately after the successful register response. The user lands directly on the dashboard with no extra step.

```ts
if (res.ok) {
  await signIn('credentials', { email, password, callbackUrl: '/dashboard' });
}
```

- **Pros:** Best UX — seamless, no friction
- **Cons:** Not compatible with email verification (can't sign in an unverified user)

---

**2. Redirect to sign-in with query param**

Redirect to `/sign-in?registered=true` and show a subtle note like "Account created — sign in to continue."

```ts
if (res.ok) {
  router.push('/sign-in?registered=true');
}
```

On the sign-in page, read the param and render a notice:
```ts
const registered = searchParams.get('registered');
// show: "Account created — sign in to continue."
```

- **Pros:** Clear feedback, user explicitly signs in
- **Cons:** One extra step vs auto sign-in

---

**3. Do nothing**

Just redirect to `/sign-in`. The context is self-explanatory — the user just registered, so signing in is the obvious next step.

```ts
if (res.ok) {
  router.push('/sign-in');
}
```

- **Pros:** Simplest implementation
- **Cons:** No confirmation feedback; user may wonder if registration succeeded

---

**4. Redirect to info page (email verification) ✅ (current approach)**

Required when email verification is enabled. Redirect to `/check-your-email` so the user knows to check their inbox before signing in.

```ts
if (res.ok) {
  router.push('/check-your-email');
}
```

The `authorize` function must block unverified users:
```ts
if (!user.emailVerified) return null;
```

- **Pros:** Secure — ensures only verified emails can access the app
- **Cons:** Most complex to implement; requires an email provider (e.g. Resend), token generation, a verify route, and a verify page

---

### Toast on sign-in vs. dedicated info page (email verification)

When email verification is required, there are two ways to inform the user after registration:

**Toast notification on `/sign-in`**
- User lands on sign-in, sees a brief toast: "Check your email to verify your account"
- Toast disappears after a few seconds — easy to miss
- Sign-in form is right there, so user may attempt to sign in immediately and hit a confusing "account not verified" error

**Dedicated `/check-your-email` page** ✅ (recommended)
- Full page with a clear instruction: "We sent a verification link to `email@example.com`"
- Can include a "Resend email" button
- No ambiguity — user knows exactly what to do before proceeding
- Standard pattern used by most apps (GitHub, Vercel, Linear, etc.)

**Verdict:** For email verification, the dedicated info page is strongly preferred. Toast is appropriate for minor, non-blocking feedback (e.g. "Profile updated") — not for a required action the user must complete before they can access the app.

---

## Two Config Files

NextAuth v5 requires splitting config for edge compatibility:

- **`auth.config.ts`** — imported by `proxy.ts` (runs on the edge). Cannot use Prisma or bcrypt here.
- **`auth.ts`** — imports `auth.config.ts` and adds the Prisma adapter + real `authorize` logic. Only runs in Node.js (API routes, server components).
