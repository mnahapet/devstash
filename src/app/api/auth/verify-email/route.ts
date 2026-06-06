import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/verify-email?error=invalid', req.url))
  }

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  })

  if (!verificationToken) {
    return NextResponse.redirect(new URL('/verify-email?error=invalid', req.url))
  }

  if (verificationToken.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } })
    return NextResponse.redirect(new URL('/verify-email?error=expired', req.url))
  }

  await prisma.user.update({
    where: { email: verificationToken.identifier },
    data: { emailVerified: new Date() },
  })

  await prisma.verificationToken.delete({ where: { token } })

  return NextResponse.redirect(new URL('/sign-in?verified=true', req.url))
}
