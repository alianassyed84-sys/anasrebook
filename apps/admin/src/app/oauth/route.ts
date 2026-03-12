import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/login?error=oauth_failed",
      request.url));
  }

  // Admin extra check happens on dashboard load
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
