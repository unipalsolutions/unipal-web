import { NextResponse, type NextRequest } from 'next/server';

// Sends signed-out visitors to the login page before any dashboard page renders.
// Pages still call requireUser(); this only avoids rendering work for anonymous requests.
export function proxy(request: NextRequest) {
  if (!request.cookies.has('unipal_hub_session')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!login|logout|_next/|brand/|favicon).*)'],
};
