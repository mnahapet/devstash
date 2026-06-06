import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    // Always return success — never reveal whether the email exists
    if (!user || !user.password) {
      return NextResponse.json({ success: true })
    }

    await prisma.verificationToken.deleteMany({
      where: { identifier: `reset:${email}` },
    })

    const token = crypto.randomBytes(32).toString('hex')
    await prisma.verificationToken.create({
      data: {
        identifier: `reset:${email}`,
        token,
        expires: new Date(Date.now() + 60 * 60 * 1000),
      },
    })

    const baseUrl = new URL(req.url).origin
    await sendPasswordResetEmail(email, token, baseUrl)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
