import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // DEVELOPMENT MODE: Allow all routes (auth checks disabled for now)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next (Next.js internals)
     * - static (inside `public`)
     * - api (API routes)
     * - favicon.ico (favicon file)
     */
    "/((?!_next|static|api|favicon.ico).*)",
  ],
};
