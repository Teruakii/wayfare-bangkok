import { redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { getCurrentUser } from "@/presentation/auth/session";
import { safeNextPath } from "@/presentation/actions/form-state";
import { Container } from "../ui";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Narrow, centered layout shared by /login and /register. */
export function AuthPage({
  title,
  intro,
  searchParams,
  form,
  aside,
}: {
  title: string;
  intro: string;
  searchParams: SearchParams;
  form: (next: string) => ReactNode;
  aside?: ReactNode;
}) {
  return (
    <Container className="py-xl md:py-2xl">
      <div className="mx-auto flex max-w-[440px] flex-col gap-lg">
        <div>
          <h1 className="font-serif text-headline-lg">{title}</h1>
          <p className="mt-sm text-body-md text-on-surface-variant">{intro}</p>
        </div>
        <Suspense fallback={<div className="h-[320px]" />}>
          <AuthGate searchParams={searchParams} form={form} />
        </Suspense>
        {aside}
      </div>
    </Container>
  );
}

/** Reads ?next= and sends visitors who are already signed in straight there. */
async function AuthGate({
  searchParams,
  form,
}: {
  searchParams: SearchParams;
  form: (next: string) => ReactNode;
}) {
  const { next: raw } = await searchParams;
  const next = safeNextPath(typeof raw === "string" ? raw : "");
  if (await getCurrentUser()) redirect(next);
  return form(next);
}
