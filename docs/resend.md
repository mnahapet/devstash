# Resend

DevStash uses [Resend](https://resend.com) to send transactional emails (currently: email verification on registration).

## Setup

1. Create an account at [resend.com](https://resend.com)
2. Generate an API key in the Resend dashboard
3. Add to `.env`:

```
RESEND_API_KEY="re_..."
APP_URL="http://localhost:3000"   # used to build verification links
```

## Key File

`src/lib/email.ts` — exports one function per email type:

```ts
sendVerificationEmail(to: string, token: string)
```

All email sending goes through this file. Add new email types here as needed.

## From Address

Currently set to `onboarding@resend.dev` — Resend's shared test sender, available on all accounts with no setup required.

**Before going to production:** replace with a verified custom domain sender, e.g. `DevStash <noreply@devstash.io>`. Domain verification is done in the Resend dashboard under Domains.

## Free Tier

| Limit | Value |
|-------|-------|
| Emails per day | 100 |
| Emails per month | 3,000 |
| Custom domains | 1 |

Sufficient for development and early production. Paid plans start at $20/month for higher volume.

## Adding New Email Types

1. Add a new exported function to `src/lib/email.ts`:

```ts
export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: 'DevStash <onboarding@resend.dev>',
    to,
    subject: 'Welcome to DevStash',
    html: `<p>Hi ${name}, welcome!</p>`,
  })
}
```

2. Import and call it from the relevant API route or server action.

## Error Handling

`sendVerificationEmail` throws on failure. The register route catches this, rolls back the newly created user and token, and returns a 500 error to the client.

Any future email send should follow the same pattern: wrap in try/catch and handle failure explicitly rather than silently swallowing the error.
