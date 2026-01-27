import { NextResponse } from 'next/server'
import { supabase } from './lib/supabaseClient'

export async function middleware(req) {
  const { pathname } = req.nextUrl

  // Allow public routes without auth
  if (
    pathname.startsWith('/auth') ||
    pathname === '/' ||
    pathname.startsWith('/harm-reduction')
  ) {
    return NextResponse.next()
  }

  // Get Supabase session
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    // Not signed in → redirect to sign-in
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  // Fetch user profile (role stored in Supabase)
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
  if (pathname.startsWith('/dashboard')) {
    if (!pathname.startsWith(`/dashboard/${role}`)) {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url))
    }
  }

  return NextResponse.next()
}
