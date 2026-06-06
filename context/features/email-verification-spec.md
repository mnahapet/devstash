# Email Verification

## Overview

After registering with email/password, users must verify their email address before they can sign in. A verification link is sent via Resend. Unverified users are blocked in the credentials `authorize` flow. GitHub OAuth users bypass this entirely.

## Flow

```
Register form submit
  → POST /api/auth/register
  → create user (emailVerified: null)
  → generate crypto token (32 bytes hex)
  → store in VerificationToken (expires: +1 hour)
  → send email via Resend — link: /verify-email?token=xxx
    (baseUrl derived from req.url — no APP_URL env var needed)
  → redirect to /check-your-email?email=xxx

User clicks link in email
  → /verify-email?token=xxx  (server component page — does all DB work)
  → token missing / not in DB  → render error UI ("Invalid verification link")
  → token expired              → delete token, render error UI ("Link has expired")
  → token valid                → set user.emailVerified, delete token
                               → render success UI ("Email Verified!")
                               → user clicks "Sign in to your account" → /sign-in

User clicks "Resend verification email" on /check-your-email
  → POST /api/auth/resend-verification { email }
  → delete existing tokens for that email
  → generate new token (expires: +1 hour)
  → send new verification email
  → returns { success: true } always (avoids email enumeration)
```

## Why a page route instead of an API route

The verify-email logic lives in `src/app/(auth)/verify-email/page.tsx` (a server component) rather than an API route. This means:

- Success renders a proper "Email Verified!" UI with a "Sign in" button — the user gets clear confirmation before proceeding
- Error states render inline error UI on the same page — no redirect chain
- The URL `/verify-email?token=xxx` in the email is clean and matches the page route directly

An API route (`GET /api/auth/verify-email`) would need to redirect on both success and failure, which is more abrupt and gives no page-level feedback.

## Key Files

| File | Role |
|------|------|
| `src/lib/email.ts` | Resend client + `sendVerificationEmail(to, token, baseUrl)` |
| `src/app/api/auth/register/route.ts` | Creates user, token, sends email; rolls back user + token on email failure |
| `src/app/api/auth/resend-verification/route.ts` | POST — deletes old token, issues new one, resends email |
| `src/app/(auth)/register/page.tsx` | Redirects to `/check-your-email?email=...` on success |
| `src/app/(auth)/check-your-email/page.tsx` | Info page: shows email address + ResendVerificationButton |
| `src/app/(auth)/verify-email/page.tsx` | Validates token, renders success UI or error UI |
| `src/components/auth/ResendVerificationButton.tsx` | Client component: calls resend API, shows sent/error feedback |
| `src/auth.ts` | `authorize`: returns null if `!user.emailVerified` |

## Environment Variables

| Variable | Example | Purpose |
|----------|---------|---------|
| `RESEND_API_KEY` | `re_...` | Resend API authentication |

> `APP_URL` is **not** required. The verification link base URL is derived from `new URL(req.url).origin` inside the API route, so it works on localhost, staging, and production automatically.

## Error States

| Scenario | Behaviour |
|----------|-----------|
| Token missing from URL | Render error UI: "Invalid verification link" |
| Token not found in DB | Render error UI: "Invalid or expired verification link" |
| Token expired | Delete token, render error UI: "Link has expired. Please request a new one." |
| Email send fails on register | Roll back user + token, return 500 to register form |
| Unverified user tries to sign in | Generic "Invalid email or password" (same as wrong password) |

## Constraints

- Verification tokens expire after **1 hour**
- Tokens are single-use — deleted immediately after successful verification
- Resend route always returns `{ success: true }` regardless of whether the email exists — prevents email enumeration
- Re-registration with an existing (unverified) email returns 409 "Email already in use" — use the Resend button instead
- GitHub OAuth users have `emailVerified` set automatically by the PrismaAdapter — unaffected by this flow
- Demo seed user has `emailVerified: new Date()` — can sign in without going through this flow

## Email

- Sent from: `DevStash <onboarding@resend.dev>` (change to verified domain in production)
- Subject: "Verify your DevStash account"
- Link points to: `/verify-email?token=xxx`
- Styled: dark theme by default, light mode via `@media (prefers-color-scheme: light)`
- Contains: button link + plain-text URL fallback (for email clients that strip hrefs on localhost)

## Testing

1. Register with a new email → verify redirect to `/check-your-email`
2. Check inbox → click verification link → verify "Email Verified!" success UI appears
3. Click "Sign in to your account" → verify redirect to `/sign-in`
4. Sign in → verify access to `/dashboard`
5. Try to sign in with an unverified account → verify blocked with generic error
6. Click "Resend verification email" on `/check-your-email` → verify new email arrives
7. Use an expired or invalid token URL → verify error UI renders with correct message
8. Sign in with GitHub → verify unaffected by email verification
