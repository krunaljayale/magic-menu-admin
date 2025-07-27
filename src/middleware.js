import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies.get('jwt_token')?.value;
  const pathname = req.nextUrl.pathname;

  if ((pathname.startsWith('/admin') || pathname === '/auth/sign-up') && !token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/auth/sign-in';
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/auth/sign-up'],
};
