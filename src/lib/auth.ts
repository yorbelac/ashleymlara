/*
 * auth.ts: everything about accounts and logging in, in one place.
 *
 * How it works:
 * 1. Someone registers: we save their email + a *hash* of their password in the
 *    users table (never the password itself).
 * 2. When they log in, we hash what they typed and compare it to the saved hash.
 * 3. If it matches, we create a JWT (JSON Web Token): a small signed note that says
 *    "this is user #abc, valid until <date>". It's signed with SESSION_SECRET, so
 *    nobody can forge or edit one without the secret.
 * 4. The JWT goes in an httpOnly cookie. The browser sends it back on every visit,
 *    and JavaScript on the page can't read it, which protects it from theft.
 * 5. On each request we look the user up in the database, so changing someone's
 *    role (e.g. with `npm run make-admin`) takes effect right away.
 */
import "server-only"; // build error if this file is ever imported into browser code
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { db } from "./db";

const COOKIE_NAME = "session";
const SESSION_DAYS = 7;
const scryptAsync = promisify(scrypt) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;

export type User = { id: string; email: string; name: string | null; role: "user" | "admin" };

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET is missing or too short (need 32+ characters). See .env.example");
  }
  return new TextEncoder().encode(secret);
}

// ---------- Passwords ----------

/** Turns a password into "salt:hash" for storing. The salt makes every hash unique. */
export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

// Used when the email doesn't exist, so a failed login takes the same time either way
// and doesn't reveal which emails have accounts.
const DUMMY_HASH = `${"0".repeat(32)}:${"0".repeat(128)}`;

export async function verifyPassword(password: string, stored: string | undefined) {
  const [saltHex, hashHex] = (stored ?? DUMMY_HASH).split(":");
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scryptAsync(password, Buffer.from(saltHex, "hex"), expected.length);
  // timingSafeEqual takes the same time whether the first or last byte differs,
  // so attackers can't guess the hash one byte at a time by measuring speed.
  return stored !== undefined && timingSafeEqual(actual, expected);
}

// ---------- Sessions ----------

export async function createSession(userId: string) {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId) // "sub" = who this token is about
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secretKey());

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true, // page JavaScript can't read it
    secure: process.env.NODE_ENV === "production", // HTTPS only on the live site
    sameSite: "lax", // not sent on sneaky cross-site form posts
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function deleteSession() {
  (await cookies()).delete(COOKIE_NAME);
}

/**
 * The logged-in user, or null. Never throws on a bad/expired token.
 * cache() means several components can call this in one request with only one DB lookup.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  let userId: string | undefined;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    userId = payload.sub;
  } catch {
    return null;
  }
  if (!userId) return null;

  const { rows } = await db().query<User>("SELECT id, email, name, role FROM users WHERE id = $1", [userId]);
  return rows[0] ?? null;
});

/** Use at the top of anything for logged-in people (pages AND server actions). */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** Use at the top of anything admin-only. Regular users are sent to their account page. */
export async function requireAdmin(): Promise<User> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/account");
  return user;
}
