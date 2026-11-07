import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ACCESS_TOKEN_COOKIE } from './lib/auth-token';

/**
 * Route protection middleware for customer accounts.
 * Enforces session authentication on protected /account routes
 * and redirects authenticated customers away from auth pages.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  // 1. Protected customer account routes
  if (pathname.startsWith('/account')) {
    if (!accessToken) {
      const returnUrl = encodeURIComponent(`${pathname}${search}`);
      const loginUrl = new URL(`/login?returnUrl=${returnUrl}`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Guest-only authentication routes (login / register)
  if (pathname === '/login' || pathname === '/register') {
    if (accessToken) {
      // Redirect to intended destination or account dashboard
      const rawReturnUrl = request.nextUrl.searchParams.get('returnUrl');
      // Validate safe relative return URL (must start with / and not //)
      const safeReturnUrl =
        rawReturnUrl && rawReturnUrl.startsWith('/') && !rawReturnUrl.startsWith('//')
          ? rawReturnUrl
          : '/account';

      return NextResponse.redirect(new URL(safeReturnUrl, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*', '/login', '/register'],
};
