/*
 * Small building blocks shared by the login and register forms.
 * Making them components means the forms look the same and we style them in one place.
 */
import type { ComponentProps } from "react";

export function Field({ label, ...input }: { label: string } & ComponentProps<"input">) {
  return (
    <label className="flex flex-col gap-1 text-left text-sm text-cream/80">
      {label}
      <input
        {...input}
        className="w-full rounded-lg border border-lilac/40 bg-night px-4 py-2 text-cream placeholder:text-cream/30 focus:border-cyan focus:outline-none"
      />
    </label>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  // role="alert" makes screen readers announce the error when it appears
  return (
    <p role="alert" className="text-sm text-pink">
      {message}
    </p>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 rounded-full bg-pink px-6 py-2 font-display text-night transition hover:bg-lemon disabled:opacity-60"
    >
      {pending ? "One sec…" : children}
    </button>
  );
}

/**
 * "Continue with Google". A plain <a>, not <Link>: it goes to a route handler that
 * redirects off-site, so there's no page for Next.js to prefetch.
 */
export function GoogleButton() {
  return (
    <>
      <a
        href="/api/auth/google"
        className="flex w-full items-center justify-center gap-3 rounded-full border border-lilac/40 bg-cream px-6 py-2 font-medium text-night transition hover:border-cyan hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
      >
        {/* Google's "G" mark. aria-hidden because the text already says Google */}
        <svg aria-hidden="true" viewBox="0 0 48 48" className="size-5">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
        Continue with Google
      </a>
      <div className="flex w-full items-center gap-3 text-xs text-cream/50">
        <span className="h-px flex-1 bg-lilac/30" />
        or use your email
        <span className="h-px flex-1 bg-lilac/30" />
      </div>
    </>
  );
}

/** The glowing card that holds the login and register forms. */
export function AuthCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border border-lilac/30 bg-dusk/60 p-8 text-center">
        <h1 className="neon-text font-display text-3xl text-pink">{title}</h1>
        {children}
      </div>
    </main>
  );
}
