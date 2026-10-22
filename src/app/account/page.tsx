/*
 * /account: what regular (logged-in) visitors see.
 * Later this could hold their wishlist, favorites, order history, etc.
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import { AccountHeader } from "@/components/account-header";

export const metadata: Metadata = { title: "Your account", robots: { index: false } };

export default function AccountPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12">
      {/* Checking the login reads a cookie, so it waits for a real visitor. <Suspense> lets the rest load first. */}
      <Suspense fallback={<p className="font-mono text-sm text-cream/50">Checking your login…</p>}>
        <Account />
      </Suspense>
    </main>
  );
}

async function Account() {
  const user = await requireUser(); // not logged in? → sent to /login

  return (
    <>
      <AccountHeader user={user} eyebrow="Your account" />
      <section className="rounded-2xl border border-lilac/30 bg-dusk/60 p-8">
        <p className="font-display text-xl text-cyan">Welcome to the club!</p>
        <p className="mt-2 max-w-md text-sm text-cream/70">
          Thanks for signing up. Members-only goodies are on the way. ✨
        </p>
      </section>
    </>
  );
}
