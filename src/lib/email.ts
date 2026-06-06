import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(to: string, token: string, baseUrl: string) {
  const verifyUrl = `${baseUrl}/verify-email?token=${token}`

  await resend.emails.send({
    from: 'DevStash <onboarding@resend.dev>',
    to,
    subject: 'Verify your DevStash account',
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    /* Light mode overrides — dark is the default (matches app default) */
    @media (prefers-color-scheme: light) {
      .wrapper  { background-color: #f4f4f5 !important; }
      .card     { background-color: #ffffff !important; border-color: #e4e4e7 !important; }
      .heading  { color: #09090b !important; }
      .body     { color: #52525b !important; }
      .muted    { color: #71717a !important; }
      .url-link { color: #3b82f6 !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#09090b;">
  <div class="wrapper" style="background-color:#09090b;padding:40px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <div class="card" style="background-color:#18181b;border:1px solid #27272a;max-width:480px;margin:0 auto;border-radius:12px;padding:40px 32px;">

      <h1 class="heading" style="color:#fafafa;font-size:22px;font-weight:700;margin:0 0 12px;letter-spacing:-0.3px;">
        Welcome to DevStash
      </h1>

      <p class="body" style="color:#a1a1aa;font-size:15px;line-height:1.6;margin:0 0 28px;">
        Thanks for signing up! Please verify your email address by clicking the button below.
      </p>

      <a href="${verifyUrl}"
         style="display:inline-block;padding:11px 22px;background-color:#3b82f6;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;letter-spacing:0.1px;">
        Verify Email Address
      </a>

      <p class="muted" style="color:#52525b;font-size:13px;line-height:1.6;margin:28px 0 8px;">
        This link will expire in 1 hour. If you didn't create a DevStash account, you can safely ignore this email.
      </p>

      <p class="muted" style="color:#52525b;font-size:13px;margin:0 0 6px;">
        If the button doesn't work, copy and paste this link into your browser:
      </p>

      <a class="url-link" href="${verifyUrl}"
         style="color:#3b82f6;font-size:12px;word-break:break-all;text-decoration:none;">
        ${verifyUrl}
      </a>

    </div>
  </div>
</body>
</html>
    `,
  })
}
