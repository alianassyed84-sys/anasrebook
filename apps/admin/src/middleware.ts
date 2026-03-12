import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/vendors/:path*",
    "/books/:path*",
    "/orders/:path*",
    "/disputes/:path*",
    "/payments/:path*",
    "/analytics/:path*",
    "/marketing/:path*",
    "/settings/:path*",
  ],
};

export function middleware(request: NextRequest) {
  // Add authentication or routing logic here if needed.
  // Assuming a basic auth check or pass-through for now
  
  return NextResponse.next();
}
