import Link from "next/link";
import { Suspense } from "react";
import { Search } from "lucide-react";
import { AuthMenu, AuthMenuFallback } from "../auth/auth-menu";
import { Container } from "../ui";

// Short labels keep the header on one line at phone width.
const NAV = [
  { href: "/restaurants", label: "Restaurants", short: "Eat" },
  { href: "/attractions", label: "Attractions", short: "See" },
  { href: "/map", label: "Map", short: "Map" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-outline bg-surface">
      <Container className="flex h-16 items-center justify-between gap-md">
        <Link href="/" className="font-serif text-[1.5rem] leading-none tracking-tight">
          Wayfare
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-center gap-md sm:gap-lg">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-label={item.label}
                  className="text-label-md uppercase text-on-surface hover:text-primary"
                >
                  <span className="sm:hidden">{item.short}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/search"
                aria-label="Search"
                className="flex text-on-surface hover:text-primary"
              >
                <Search aria-hidden size={20} strokeWidth={1.5} />
              </Link>
            </li>
            <li>
              {/* Reads the session cookie, so it streams in after the static header. */}
              <Suspense fallback={<AuthMenuFallback />}>
                <AuthMenu />
              </Suspense>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto bg-surface-muted py-xl">
      <Container className="flex flex-col gap-sm md:flex-row md:items-center md:justify-between">
        <p className="font-serif text-title-md">Wayfare</p>
        <p className="text-body-sm text-on-surface-variant">
          A quiet guide to Bangkok. Sample data — check hours and prices before you go.
        </p>
      </Container>
    </footer>
  );
}
