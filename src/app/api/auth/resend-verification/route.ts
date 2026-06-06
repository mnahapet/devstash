import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    // Return success regardless to avoid revealing whether the email exists
    if (!user || user.emailVerified) {
      return NextResponse.json({ success: true })
    }

    await prisma.verificationToken.deleteMany({ where: { identifier: email } })

    const token = crypto.randomBytes(32).toString('hex')
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 60 * 60 * 1000),
      },
    })

    await sendVerificationEmail(email, token)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
