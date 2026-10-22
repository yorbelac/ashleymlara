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
