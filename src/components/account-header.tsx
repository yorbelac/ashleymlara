/*
 * The greeting + log out button at the top of /account and /studio.
 */
import type { User } from "@/lib/auth";
import { logout } from "@/lib/auth-actions";

export function AccountHeader({ user, eyebrow }: { user: User; eyebrow: string }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="font-mono text-xs tracking-[0.3em] text-cyan uppercase">{eyebrow}</p>
        <h1 className="neon-text font-display text-4xl text-pink">Hi, {user.name || "friend"} ✦</h1>
        <p className="mt-1 text-sm text-cream/50">Logged in as {user.email}</p>
      </div>
      <form action={logout}>
        <button className="rounded-full border border-lilac/50 px-5 py-2 text-sm text-cream/80 hover:border-pink hover:text-pink">
          Log out
        </button>
      </form>
    </header>
  );
}
