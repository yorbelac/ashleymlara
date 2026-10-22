import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/form-parts";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = { title: "Make an account", robots: { index: false } };

export default function RegisterPage() {
  return (
    <AuthCard title="Join the club">
      <RegisterForm />
      <p className="text-sm text-cream/60">
        Already have an account?{" "}
        <Link href="/login" className="text-cyan hover:text-lemon">
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}
