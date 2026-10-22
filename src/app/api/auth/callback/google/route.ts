/*
 * GET /api/auth/callback/google: Google sends the visitor back here after they pick an account.
 * We verify everything, find or create their account, and give them our normal session.
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CALLBACK_PATH, OAUTH_COOKIE, finishGoogleSignIn, type GoogleProfile } from "@/lib/google";

type Row = { id: string; role: string };

async function findOrCreateUser({ sub, email, name }: GoogleProfile): Promise<Row | undefined> {
  // Returning Google user (matched by Google's id, which survives email changes)
  const existing = await db().query<Row>("SELECT id, role FROM users WHERE google_sub = $1", [sub]);
  if (existing.rows[0]) return existing.rows[0];

  // New person, or someone who registered with a password using this email.
  // When linking, we clear the password: we never verified that email, but Google has,
  // so this stops anyone who pre-registered someone else's email from keeping access.
  const { rows } = await db().query<Row>(
    `INSERT INTO users (email, name, google_sub) VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE
       SET google_sub = EXCLUDED.google_sub, password_hash = NULL, name = COALESCE(users.name, EXCLUDED.name)
       WHERE users.google_sub IS NULL
     RETURNING id, role`,
    [email, name, sub],
  );
  return rows[0]; // undefined if this email is already linked to a different Google account
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const jar = await cookies();
  const saved = jar.get(OAUTH_COOKIE)?.value;
  jar.delete({ name: OAUTH_COOKIE, path: "/api/auth" }); // one use only

  let user: Row | undefined;
  try {
    const { state, nonce, verifier } = JSON.parse(saved ?? "{}");
    const code = params.get("code");
    if (!code || !state || params.get("state") !== state) throw new Error("Google sign-in state mismatch");
    const profile = await finishGoogleSignIn(code, new URL(CALLBACK_PATH, request.url).toString(), nonce, verifier);
    user = await findOrCreateUser(profile);
  } catch (error) {
    // Cancelled on Google's screen, expired, or tampered with. Log it, but keep the details from the visitor.
    if (!params.get("error")) console.error("[google] sign-in failed:", error instanceof Error ? error.message : error);
  }

  // redirect() works by throwing, so it stays outside the try/catch
  if (!user) redirect("/login?error=google");
  await createSession(user.id);
  redirect(user.role === "admin" ? "/studio" : "/account");
}
