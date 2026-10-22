import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/form-parts";
import { LoginForm } from "./login-form";

// Keep account pages out of Google
export const metadata: Metadata = { title: "Log in", robots: { index: false } };

export default function LoginPage() {
  return (
    <AuthCard title="Welcome back">
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
