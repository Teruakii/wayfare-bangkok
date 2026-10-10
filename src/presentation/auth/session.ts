import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { container } from "@/di/container";
import type { Session, User } from "@/domain/entities";
import { SESSION_COOKIE } from "./constants";

export async function getSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

/** The signed-in user, or null. Reads cookies, so call it inside <Suspense>. */
export async function getCurrentUser(): Promise<User | null> {
  const token = await getSessionToken();
  // Session checks compare expiry with the current time, so they must run at
  // request time — never during (runtime) prefetch prerendering.
  await connection();
  return container.auth.getCurrentUser(token);
}

/** Like getCurrentUser, but sends signed-out visitors to /login?next=… */
export async function requireUser(returnTo: string): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(returnTo)}`);
  return user;
}

/** Call from a Server Function after login/register. */
export async function setSessionCookie(session: Session): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: session.expiresAt,
  });
}

/** Call from a Server Function on logout. */
export async function clearSessionCookie(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
