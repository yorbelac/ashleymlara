/*
 * GET /api/auth/google: the "Continue with Google" button links here.
 * We remember a few one-time secrets in a cookie, then send the visitor to Google.
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CALLBACK_PATH, OAUTH_COOKIE, startGoogleSignIn } from "@/lib/google";

export async function GET(request: Request) {
  const { url, saved } = startGoogleSignIn(new URL(CALLBACK_PATH, request.url).toString());

  (await cookies()).set(OAUTH_COOKIE, saved, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // must be lax: Google sends them back with a normal link-style visit
    path: "/api/auth",
    maxAge: 10 * 60, // ten minutes to finish signing in
  });

  redirect(url.toString());
}
