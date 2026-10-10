import Link from "next/link";
import { CircleUserRound, LogIn } from "lucide-react";
import { logoutAction } from "@/presentation/actions/auth";
import { getCurrentUser } from "@/presentation/auth/session";

const linkClass =
  "flex items-center gap-xs text-label-md uppercase text-on-surface hover:text-primary";

/** Header account links. Reads the session, so render it inside <Suspense>. */
export async function AuthMenu() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Link href="/login" className={linkClass} aria-label="Log in">
        <LogIn aria-hidden size={20} strokeWidth={1.5} className="sm:hidden" />
        <span className="hidden sm:inline">Log in</span>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-lg">
      <Link href="/dashboard" className={linkClass} aria-label={`Dashboard for ${user.name}`}>
        <CircleUserRound aria-hidden size={20} strokeWidth={1.5} />
        <span className="hidden max-w-[12ch] truncate normal-case tracking-normal md:inline">
          {user.name}
        </span>
      </Link>
      {/* On phones, log out from the dashboard to keep the header on one line. */}
      <form action={logoutAction} className="hidden sm:block">
        <button type="submit" className={linkClass}>
          Log out
        </button>
      </form>
    </div>
  );
}

export function AuthMenuFallback() {
  return <span aria-hidden className="block size-5" />;
}
