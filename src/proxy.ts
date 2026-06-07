import { NextResponse, type NextRequest } from 'next/server'
import { updateSession, isAdminRole } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user, role } = await updateSession(request)

  const path = request.nextUrl.pathname
  const isAdminRoute = path.startsWith('/admin')
  const isLoginPage = path === '/admin/login'
  const isDraftRoute = path.startsWith('/api/draft')

  // --- Unauthenticated users ---
  // Any /admin route (except /admin/login itself) → redirect to login
  if (isAdminRoute && !isLoginPage && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  // --- Authenticated but wrong role ---
  // Authenticated user on /admin routes must have admin or super_admin role.
  // An editor or viewer with a valid session cannot proceed.
  if (isAdminRoute && !isLoginPage && user && !isAdminRole(role)) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('error', 'insufficient_permissions')
    return NextResponse.redirect(url)
  }

  // --- Draft mode guard ---
  // /api/draft/enable requires an authenticated admin — handled inside the route handler.
  // We add an early reject here for completely anonymous requests.
  if (isDraftRoute && path.includes('enable') && !user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // --- Already logged-in admin visiting login page ---
  if (isLoginPage && user && isAdminRole(role)) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - any file with an extension (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
