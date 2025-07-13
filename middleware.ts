import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Important: Refresh session to ensure it's valid
  const { data: { session }, error } = await supabase.auth.getSession();
  
  console.log('Middleware - Path:', req.nextUrl.pathname);
  console.log('Middleware - Session:', session ? 'exists' : 'null');
  console.log('Middleware - Error:', error);

  // Protected routes - only redirect if not authenticated
  const protectedPaths = ['/dashboard', '/tasks', '/focus', '/log', '/settings'];
  const isProtectedPath = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path));

  if (!session && isProtectedPath) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/tasks/:path*',
    '/focus/:path*',
    '/log/:path*',
    '/settings/:path*'
  ],
};