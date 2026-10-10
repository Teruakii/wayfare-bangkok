import type { Metadata } from "next";
import { RegisterForm } from "@/presentation/components/auth/auth-forms";
import { AuthPage } from "@/presentation/components/auth/auth-page";

export const metadata: Metadata = { title: "Create an account — Wayfare" };

export default function RegisterPage({ searchParams }: PageProps<"/register">) {
  return (
    <AuthPage
      title="Create an account"
      intro="Keep a list of places you love and write reviews."
      searchParams={searchParams}
      form={(next) => <RegisterForm next={next} />}
    />
  );
}
