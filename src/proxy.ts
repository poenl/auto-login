import { NextResponse, NextRequest } from 'next/server'
import { decrypt, encrypt } from './lib/session'

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const path = new URL(request.url).pathname
  const session = request.cookies.get('session')

  try {
    const payload = await decrypt(session?.value)

    if (Date.parse(payload.expiresAt) - Date.now() < 1 * 24 * 60 * 60 * 1000) {
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      const session = await encrypt({ name: payload.name, expiresAt })

      const response = NextResponse.next()
      response.cookies.set({
        name: 'session',
        value: session,
        path: '/',
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax'
      })

      return response
    }
  } catch {
    if (path.startsWith('/api')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
}

export const config = {
  matcher: ['/(api/(?!auth).*)', '/', '/site', '/profile', '/settings']
}
