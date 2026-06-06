import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(to: string, token: string) {
  const verifyUrl = `${process.env.APP_URL}/api/auth/verify-email?token=${token}`

  await resend.emails.send({
    from: 'DevStash <onboarding@resend.dev>',
    to,
    subject: 'Verify your DevStash email address',
    html: `
      <p>Thanks for signing up for DevStash!</p>
      <p>Click the link below to verify your email address:</p>
      <p><a href="${verifyUrl}">Verify email address</a></p>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't create a DevStash account, you can safely ignore this email.</p>
    `,
  })
}
