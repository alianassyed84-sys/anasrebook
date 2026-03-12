import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // After Google login, Appwrite redirects here
  // Session is already created by Appwrite automatically
  // Just redirect user to the right page
  const url = new URL(request.url);
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/login?error=oauth_failed",
      request.url));
  }

  // Success — go to home page
  return NextResponse.redirect(new URL("/", request.url));
}
