"use client";

import { useActionState } from "react";
import { register } from "@/lib/auth-actions";
import { Field, FormError, SubmitButton } from "@/components/form-parts";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(register, undefined);

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <Field label="Name" name="name" autoComplete="name" maxLength={80} defaultValue={state?.name} />
      <Field label="Email" name="email" type="email" autoComplete="email" required defaultValue={state?.email} />
      <Field
        label="Password (10+ characters)"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={10}
        required
      />
      <FormError message={state?.error} />
      <SubmitButton pending={pending}>Create account</SubmitButton>
    </form>
  );
}
