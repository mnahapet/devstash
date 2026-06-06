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
  → send email via Resend — link: /api/auth/verify-email?token=xxx
  → redirect to /check-your-email?email=xxx

User clicks link in email
  → GET /api/auth/verify-email?token=xxx
  → token missing / not in DB  → redirect /verify-email?error=invalid
  → token expired              → delete token, redirect /verify-email?error=expired
  → token valid                → set user.emailVerified, delete token
                               → redirect /sign-in?verified=true

Sign-in page (/sign-in?verified=true)
  → shows "Email verified — sign in to continue." banner
  → user signs in normally → /dashboard

User clicks "Resend verification email" on /check-your-email
  → POST /api/auth/resend-verification { email }
  → delete existing tokens for that email
  → generate new token (expires: +1 hour)
  → send new verification email
  → returns { success: true } always (avoids email enumeration)
```

## Key Files

| File | Role |
|------|------|
| `src/lib/email.ts` | Resend client + `sendVerificationEmail(to, token)` |
| `src/app/api/auth/register/route.ts` | Creates user, token, sends email; rolls back user + token on email failure |
| `src/app/api/auth/verify-email/route.ts` | GET — validates token, sets `emailVerified`, redirects |
| `src/app/api/auth/resend-verification/route.ts` | POST — deletes old token, issues new one, resends email |
| `src/app/(auth)/register/page.tsx` | Redirects to `/check-your-email?email=...` on success |
| `src/app/(auth)/check-your-email/page.tsx` | Info page: shows email address + ResendVerificationButton |
| `src/app/(auth)/verify-email/page.tsx` | Error-only page: renders message based on `?error=` param |
| `src/components/auth/ResendVerificationButton.tsx` | Client component: calls resend API, shows sent/error feedback |
| `src/auth.ts` | `authorize`: returns null if `!user.emailVerified` |
| `src/app/(auth)/sign-in/page.tsx` | Shows verified banner on `?verified=true` |

## Environment Variables

| Variable | Example | Purpose |
|----------|---------|---------|
| `RESEND_API_KEY` | `re_...` | Resend API authentication |
| `APP_URL` | `http://localhost:3000` | Base URL for verification links in emails |

## Error States

| Scenario | Behaviour |
|----------|-----------|
| Token missing from URL | Redirect `/verify-email?error=invalid` |
| Token not found in DB | Redirect `/verify-email?error=invalid` |
| Token expired | Delete token, redirect `/verify-email?error=expired` |
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
- Subject: "Verify your DevStash email address"
- Link points to: `GET /api/auth/verify-email?token=xxx`
- Contains: verification link, 1-hour expiry note, ignore notice

## Testing

1. Register with a new email → verify redirect to `/check-your-email`
2. Check inbox → click verification link → verify redirect to `/sign-in?verified=true`
3. Verify "Email verified — sign in to continue." banner on sign-in page
4. Sign in → verify access to `/dashboard`
5. Try to sign in with an unverified account → verify blocked with generic error
6. Click "Resend verification email" on `/check-your-email` → verify new email arrives
7. Use an expired or invalid token URL → verify error page renders with correct message
8. Sign in with GitHub → verify unaffected by email verification
