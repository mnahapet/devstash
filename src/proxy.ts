import NextAuth from 'next-auth'
import { authConfig } from '@/auth.config'

const { auth } = NextAuth(authConfig)

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth
  const pathname = req.nextUrl.pathname

  if (pathname.startsWith('/dashboard') && !isLoggedIn) {
    const signInUrl = new URL('/sign-in', req.nextUrl)
    signInUrl.searchParams.set('callbackUrl', req.nextUrl.href)
    return Response.redirect(signInUrl)
  }
})

export const config = {
  matcher: ['/dashboard/:path*'],
}
