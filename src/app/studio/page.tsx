/*
 * /studio: the admin space. Only admins get in; regular users are sent to /account.
 * This is where control surfaces go (editing the collection, uploading photos, etc.).
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { AccountHeader } from "@/components/account-header";

export const metadata: Metadata = { title: "Studio", robots: { index: false } };

export default function StudioPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12">
      {/* Checking the login reads a cookie, so it waits for a real visitor. <Suspense> lets the rest load first. */}
      <Suspense fallback={<p className="font-mono text-sm text-cream/50">Checking your login…</p>}>
        <Studio />
      </Suspense>
    </main>
  );
}

async function Studio() {
  const user = await requireAdmin(); // not an admin? → sent away

  return (
    <>
      <AccountHeader user={user} eyebrow="Studio" />

      {/* The open space: each control surface becomes a panel in this grid */}
      <section className="grid min-h-80 place-items-center rounded-2xl border-2 border-dashed border-lilac/30 p-8 text-center">
        <div>
          <p className="font-display text-xl text-lilac">Your space</p>
          <p className="mt-2 max-w-sm text-sm text-cream/60">
            Nothing here yet. This is where your tools will live: adding toys, uploading photos, writing posts.
          </p>
        </div>
      </section>
    </>
  );
}
