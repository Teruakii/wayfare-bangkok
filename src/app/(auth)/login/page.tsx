import type { Metadata } from "next";
import { demoAccount } from "@/di/container";
import { LoginForm } from "@/presentation/components/auth/auth-forms";
import { AuthPage } from "@/presentation/components/auth/auth-page";

export const metadata: Metadata = { title: "Log in — Wayfare" };

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <AuthPage
      title="Log in"
      intro="Save places and share what you thought of them."
      searchParams={searchParams}
      form={(next) => <LoginForm next={next} />}
      aside={
        demoAccount && (
          <p className="rounded-md bg-surface-muted p-md text-body-sm text-on-surface-variant">
            Demo account: <span className="text-on-surface">{demoAccount.email}</span> /{" "}
            <span className="text-on-surface">{demoAccount.password}</span>
          </p>
        )
      }
    />
  );
}
