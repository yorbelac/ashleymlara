import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthCard, FormError, GoogleButton } from "@/components/form-parts";
import { LoginForm } from "./login-form";

// Keep account pages out of Google
export const metadata: Metadata = { title: "Log in", robots: { index: false } };

type SearchParams = Promise<{ error?: string }>;

// Reading the URL is request-time data, so it lives in its own small piece inside <Suspense>
async function GoogleError({ searchParams }: { searchParams: SearchParams }) {
  const { error } = await searchParams;
  return error === "google" ? <FormError message="Google sign-in didn't go through. Want to try again?" /> : null;
}

export default function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <AuthCard title="Welcome back">
      <Suspense>
        <GoogleError searchParams={searchParams} />
      </Suspense>
      <GoogleButton />
      <LoginForm />
      <p className="text-sm text-cream/60">
        New here?{" "}
        <Link href="/register" className="text-cyan hover:text-lemon">
          Make an account
        </Link>
      </p>
      <Link href="/" className="text-xs text-cream/50 hover:text-cyan">
        ← Back to the site
      </Link>
    </AuthCard>
  );
}
