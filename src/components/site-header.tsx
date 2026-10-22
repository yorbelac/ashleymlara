/*
 * The bar across the top of every page: site name on the left,
 * log in / account links on the right.
 */
import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";

const linkClass = "text-sm text-cream/80 hover:text-cyan";
const pillClass =
  "rounded-full border border-pink/60 px-4 py-1.5 text-sm text-pink transition hover:border-lemon hover:text-lemon";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-lilac/20 bg-night/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-lg text-pink hover:text-lemon">
          {/* The same little sun as the browser tab icon */}
          <span aria-hidden="true" className="size-5 rounded-full bg-gradient-to-b from-lemon via-pink to-lilac" />
          Ashley M. Lara
        </Link>

        {/*
          Who's logged in depends on the visitor's cookie, so this part waits for the
          request. <Suspense> lets the rest of the header show instantly. The fallback
          is an empty box the same size, so nothing jumps around when it loads.
        */}
        <Suspense fallback={<div className="h-8 w-20" />}>
          <AccountLinks />
        </Suspense>
      </div>
    </header>
  );
}

async function AccountLinks() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Link href="/login" className={pillClass}>
        Log in
      </Link>
    );
  }

  return (
    <nav className="flex items-center gap-4">
      {user.role === "admin" && (
        <Link href="/studio" className={linkClass}>
          Studio
        </Link>
      )}
      <Link href="/account" className={pillClass}>
        Account
      </Link>
    </nav>
  );
}
