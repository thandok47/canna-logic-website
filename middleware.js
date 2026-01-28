import { NextResponse } from 'next/server'
import { supabase } from './lib/supabaseClient'

export async function middleware(req) {
  const { pathname } = req.nextUrl

  // Only run auth checks for dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const session = await supabase.auth.getSession()
    if (!session?.user) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile) {
      return NextResponse.redirect(new URL('/auth/role', req.url))
    }

    const role = profile.role

    // Redirect based on role
    if (!pathname.startsWith(`/dashboard/${role}`)) {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url))
    }
  }

  // For everything else (homepage, auth routes, etc.), just continue
  return NextResponse.next()
}
