/*
 * Server Actions for accounts: functions that run on the server but can be
 * called straight from a <form>. Passwords never touch browser JavaScript.
 */
"use server";

import { redirect } from "next/navigation";
import { db } from "./db";
import { createSession, deleteSession, hashPassword, verifyPassword } from "./auth";

// What the form gets back when something's wrong. We send the typed values back
// so the form can refill them (React clears forms after submitting).
export type FormState = { error?: string; email?: string; name?: string } | undefined;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function register(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim().slice(0, 80);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  // Always check on the server too. Browser checks (like `required`) are easy to skip.
  if (!EMAIL_PATTERN.test(email)) return { error: "That email doesn't look quite right.", email, name };
  if (password.length < 10) return { error: "Passwords need at least 10 characters.", email, name };
  if (password.length > 200) return { error: "That password is too long.", email, name };

  const { rows } = await db().query<{ id: string }>(
    `INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3)
     ON CONFLICT (email) DO NOTHING RETURNING id`,
    [email, name || null, await hashPassword(password)],
  );
  if (rows.length === 0) return { error: "There's already an account with that email. Try logging in?", email, name };

  await createSession(rows[0].id);
  redirect("/account");
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const { rows } = await db().query<{ id: string; password_hash: string | null; role: string }>(
    "SELECT id, password_hash, role FROM users WHERE email = $1",
    [email],
  );
  const user = rows[0];

  // Google-only accounts have no password, so they fail here like a wrong password would
  if (!(await verifyPassword(password, user?.password_hash ?? undefined))) {
    // A small pause makes password guessing slower
    await new Promise((r) => setTimeout(r, 750));
    // Same message whether the email or password was wrong, so we don't hint which
    return { error: "That email and password don't match. Try again?", email };
  }

  await createSession(user.id);
  redirect(user.role === "admin" ? "/studio" : "/account");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
