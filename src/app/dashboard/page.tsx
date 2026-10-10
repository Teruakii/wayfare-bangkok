import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { container } from "@/di/container";
import type { User } from "@/domain/entities";
import { logoutAction } from "@/presentation/actions/auth";
import { requireUser } from "@/presentation/auth/session";
import { PlaceGrid, PlaceTypeBadge, toAreaNames } from "@/presentation/components/place";
import { StarRating } from "@/presentation/components/review";
import { formatReviewDate } from "@/presentation/format";
import { Button, ButtonLink, Container, Divider, cx } from "@/presentation/components/ui";

export const metadata: Metadata = { title: "Your dashboard — Wayfare" };

type Tab = "saved" | "reviews";

export default function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  return (
    <Container className="py-xl md:py-2xl">
      <Suspense fallback={<div className="h-[50vh]" />}>
        <Dashboard searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}

async function Dashboard({ searchParams }: Pick<PageProps<"/dashboard">, "searchParams">) {
  // proxy.ts already bounced visitors without a cookie; this verifies the session itself.
  const user = await requireUser("/dashboard");
  const tab: Tab = (await searchParams).tab === "reviews" ? "reviews" : "saved";
  const [saved, reviews] = await Promise.all([
    container.favorites.listMine(user.id),
    container.reviews.listMine(user.id),
  ]);

  return (
    <div className="flex flex-col gap-xl">
      <header className="flex flex-col gap-md sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-label-md uppercase text-on-surface-variant">Your Wayfare</p>
          <h1 className="mt-sm font-serif text-headline-lg md:text-display">Hi, {firstName(user)}</h1>
        </div>
        <form action={logoutAction}>
          <Button type="submit" variant="ghost" className="border border-outline">
            Log out
          </Button>
        </form>
      </header>

      <nav aria-label="Dashboard sections" className="flex gap-lg border-b border-outline">
        <TabLink href="/dashboard" active={tab === "saved"} count={saved.length}>
          Saved places
        </TabLink>
        <TabLink href="/dashboard?tab=reviews" active={tab === "reviews"} count={reviews.length}>
          My reviews
        </TabLink>
      </nav>

      {tab === "saved" ? (
        saved.length === 0 ? (
          <EmptyState
            text="Nothing saved yet. Tap “Save place” on anything you’d like to remember."
            cta={{ href: "/restaurants", label: "Find a place to eat" }}
          />
        ) : (
          <PlaceGrid places={saved} areaNames={toAreaNames(await container.places.listAreas())} />
        )
      ) : reviews.length === 0 ? (
        <EmptyState
          text="You haven’t reviewed anything yet. Your reviews will show up here."
          cta={{ href: "/attractions", label: "Explore attractions" }}
        />
      ) : (
        <ul className="max-w-[720px]">
          {reviews.map(({ review, place }, i) => (
            <li key={review.id}>
              {i > 0 && <Divider className="my-lg" />}
              <article className="flex flex-col gap-sm">
                <div className="flex flex-wrap items-center gap-x-md gap-y-xs">
                  <Link
                    href={`/places/${place.id}`}
                    className="text-title-md hover:underline underline-offset-4"
                  >
                    {place.name}
                  </Link>
                  <PlaceTypeBadge place={place} />
                </div>
                <div className="flex items-center gap-md">
                  <StarRating value={review.rating} size={14} />
                  <time
                    dateTime={review.createdAt.toISOString()}
                    className="text-body-sm text-on-surface-variant"
                  >
                    {formatReviewDate(review.createdAt)}
                  </time>
                </div>
                <p className="text-body-md">{review.comment}</p>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function firstName(user: User): string {
  return user.name.split(" ")[0] || user.name;
}

function TabLink({
  href,
  active,
  count,
  children,
}: {
  href: string;
  active: boolean;
  count: number;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cx(
        "-mb-px border-b-2 pb-sm text-label-md uppercase transition-colors",
        active
          ? "border-primary text-primary"
          : "border-transparent text-on-surface-variant hover:text-on-surface",
      )}
    >
      {children} <span className="text-on-surface-variant">({count})</span>
    </Link>
  );
}

function EmptyState({ text, cta }: { text: string; cta: { href: string; label: string } }) {
  return (
    <div className="flex flex-col items-start gap-lg rounded-lg bg-surface-muted p-xl">
      <p className="max-w-[560px] text-body-lg text-on-surface-variant">{text}</p>
      <ButtonLink href={cta.href}>{cta.label}</ButtonLink>
    </div>
  );
}
