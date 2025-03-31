import { NextResponse } from 'next/server';

export function middleware(request) {
  // Log all requests to help with debugging
  console.log(`[Middleware] Request: ${request.method} ${request.nextUrl.pathname}`);
  return NextResponse.next();
}

export const config = {
  // Match all request paths
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
