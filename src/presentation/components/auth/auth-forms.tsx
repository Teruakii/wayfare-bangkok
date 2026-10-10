"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, registerAction } from "@/presentation/actions/auth";
import type { FormState } from "@/presentation/actions/form-state";
import { Alert, Button, Input } from "../ui";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(loginAction, {} as FormState);
  return (
    <form action={action} className="flex flex-col gap-lg" noValidate>
      <input type="hidden" name="next" value={next} />
      {state.error && <Alert>{state.error}</Alert>}
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        error={state.fieldErrors?.password}
      />
      <Button type="submit" disabled={pending} className="mt-sm">
        {pending ? "Logging in…" : "Log in"}
      </Button>
      <p className="text-body-sm text-on-surface-variant">
        New to Wayfare?{" "}
        <Link href={`/register?next=${encodeURIComponent(next)}`} className="text-primary underline underline-offset-4">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(registerAction, {} as FormState);
  return (
    <form action={action} className="flex flex-col gap-lg" noValidate>
      <input type="hidden" name="next" value={next} />
      {state.error && <Alert>{state.error}</Alert>}
      <Input
        label="Name"
        name="name"
        autoComplete="name"
        required
        defaultValue={state.values?.name}
        error={state.fieldErrors?.name}
      />
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        error={state.fieldErrors?.password}
      />
      <Button type="submit" disabled={pending} className="mt-sm">
        {pending ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-body-sm text-on-surface-variant">
        Already have an account?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-primary underline underline-offset-4">
          Log in
        </Link>
      </p>
    </form>
  );
}
