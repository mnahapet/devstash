import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'

const skipEmailVerification = process.env.SKIP_EMAIL_VERIFICATION === 'true'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, confirmPassword } = await req.json()

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)

    if (skipEmailVerification) {
      await prisma.user.create({
        data: { name, email, password: hashed, emailVerified: new Date() },
      })
      return NextResponse.json({ success: true, emailVerificationRequired: false }, { status: 201 })
    }

    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    })

    const token = crypto.randomBytes(32).toString('hex')
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 60 * 60 * 1000),
      },
    })

    try {
      const baseUrl = new URL(req.url).origin
      await sendVerificationEmail(email, token, baseUrl)
    } catch {
      await prisma.user.delete({ where: { id: user.id } })
      await prisma.verificationToken.deleteMany({ where: { identifier: email } })
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, emailVerificationRequired: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
