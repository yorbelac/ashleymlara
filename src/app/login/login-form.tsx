/*
 * "use client" = this component runs in the browser, because it shows
 * live feedback (the error message and the busy button).
 */
"use client";

import { useActionState } from "react";
import { login } from "@/lib/auth-actions";
import { Field, FormError, SubmitButton } from "@/components/form-parts";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <Field label="Email" name="email" type="email" autoComplete="email" required defaultValue={state?.email} />
      <Field label="Password" name="password" type="password" autoComplete="current-password" required />
      <FormError message={state?.error} />
      <SubmitButton pending={pending}>Log in</SubmitButton>
    </form>
  );
}
