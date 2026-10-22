/*
 * not-found.tsx: shown whenever someone visits a page that doesn't exist.
 */
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-mono text-sm tracking-[0.3em] text-cyan">ERROR 404</p>
      <h1 className="neon-text font-display text-4xl text-pink">Lost in the cosmos</h1>
      <p className="text-cream/70">This page floated off somewhere.</p>
      {/* <Link> is Next.js's version of <a>: it pre-loads the page so clicks feel instant */}
      <Link href="/" className="mt-4 rounded-full bg-pink px-6 py-2 font-display text-night hover:bg-lemon">
        Take me home
      </Link>
    </main>
  );
}
