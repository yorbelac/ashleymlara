/*
 * google.ts: "Sign in with Google" (OAuth 2.0 / OpenID Connect), without extra libraries.
 *
 * How it works:
 * 1. /api/auth/google sends the visitor to Google with a random `state`, `nonce`, and a
 *    PKCE "code challenge". We remember the matching secrets in a short-lived cookie.
 * 2. Google sends them back to /api/auth/callback/google with a one-time `code`.
 * 3. We check `state` matches (so nobody can trick a browser into someone else's login),
 *    trade the code for an ID token (proving we hold the PKCE secret), and verify the
 *    token's signature, audience, and nonce.
 * 4. The token tells us who they are; the callback then issues our normal session cookie.
 */
import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { createRemoteJWKSet, jwtVerify } from "jose";

export const OAUTH_COOKIE = "google_oauth";
export const CALLBACK_PATH = "/api/auth/callback/google";

// Google's public signing keys. jose fetches and caches them.
const GOOGLE_KEYS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

function credentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are missing. See .env.example");
  return { clientId, clientSecret };
}

const random = () => randomBytes(32).toString("base64url");

/** The Google URL to send the visitor to, plus the secrets to keep in a cookie until they return. */
export function startGoogleSignIn(redirectUri: string) {
  const state = random();
  const nonce = random();
  const verifier = random();
  const challenge = createHash("sha256").update(verifier).digest("base64url");

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({
    client_id: credentials().clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    nonce,
    code_challenge: challenge,
    code_challenge_method: "S256",
    prompt: "select_account", // let people pick which Google account to use
  }).toString();

  return { url, saved: JSON.stringify({ state, nonce, verifier }) };
}

export type GoogleProfile = { sub: string; email: string; name: string | null };

/** Trades the one-time code for a verified profile. Throws if anything doesn't check out. */
export async function finishGoogleSignIn(code: string, redirectUri: string, nonce: string, verifier: string) {
  const { clientId, clientSecret } = credentials();
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
      code_verifier: verifier,
    }),
  });
  if (!res.ok) throw new Error(`Google token exchange failed (${res.status})`);
  const { id_token } = (await res.json()) as { id_token?: string };
  if (!id_token) throw new Error("Google didn't return an ID token");

  const { payload } = await jwtVerify(id_token, GOOGLE_KEYS, {
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    audience: clientId,
  });
  if (payload.nonce !== nonce) throw new Error("Google sign-in nonce mismatch");
  // Only trust emails Google has confirmed belong to this person
  if (payload.email_verified !== true || typeof payload.email !== "string" || !payload.sub) {
    throw new Error("Google account has no verified email");
  }

  return {
    sub: payload.sub,
    email: payload.email.toLowerCase(),
    name: typeof payload.name === "string" ? payload.name.slice(0, 80) : null,
  } satisfies GoogleProfile;
}
