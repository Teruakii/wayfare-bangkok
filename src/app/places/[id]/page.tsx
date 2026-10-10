import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { ArrowLeft, Navigation } from "lucide-react";
import { container } from "@/di/container";
import type { Place } from "@/domain/entities";
import { NotFoundError } from "@/domain/errors";
import {
  PlaceFacts,
  PlaceMeta,
  PlaceTypeBadge,
  toAreaNames,
} from "@/presentation/components/place";
import { FavoriteSlot, FavoriteSlotFallback } from "@/presentation/components/favorite";
import { PlaceMap } from "@/presentation/components/map";
import { toMapPlaces } from "@/presentation/components/map/map-place";
import { RatingSummary, ReviewList } from "@/presentation/components/review";
import { ReviewComposer } from "@/presentation/components/review/review-composer";
import { Container, Section, buttonClasses } from "@/presentation/components/ui";

export async function generateStaticParams() {
  return (await container.places.list()).map((place) => ({ id: place.id }));
}

async function findPlace(id: string): Promise<Place> {
  try {
    return await container.places.getById(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: PageProps<"/places/[id]">): Promise<Metadata> {
  const place = await findPlace((await params).id);
  return { title: `${place.name} — Wayfare Bangkok`, description: place.description };
}

export default async function PlacePage({ params }: PageProps<"/places/[id]">) {
  const place = await findPlace((await params).id);
  const areaNames = toAreaNames(await container.places.listAreas());
  const areaName = areaNames.get(place.location.areaId);
  const { lat, lng } = place.location;
  const back =
    place.type === "restaurant"
      ? { href: "/restaurants", label: "Restaurants" }
      : { href: "/attractions", label: "Attractions" };

  return (
    <article>
      <Container className="pt-lg md:pt-xl">
        <Link
          href={back.href}
          className="inline-flex items-center gap-xs text-label-md uppercase text-on-surface-variant hover:text-primary"
        >
          <ArrowLeft aria-hidden size={16} strokeWidth={1.5} />
          {back.label}
        </Link>
        <div className="relative mt-lg aspect-[3/2] overflow-hidden rounded-lg bg-surface-muted md:aspect-[21/9]">
          <Image
            src={place.photo.src}
            alt={place.photo.alt}
            fill
            preload
            sizes="(min-width: 1200px) 1104px, 100vw"
            className="object-cover"
          />
        </div>
      </Container>

      <Container className="grid gap-xl py-xl md:py-2xl lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-2xl">
        <div className="flex flex-col gap-md">
          <PlaceTypeBadge place={place} className="self-start" />
          <h1 className="font-serif text-headline-lg md:text-display">{place.name}</h1>
          <PlaceMeta place={place} areaName={areaName} />
          <p className="mt-sm max-w-[720px] text-body-lg">{place.description}</p>
          <div className="mt-md">
            <Suspense fallback={<FavoriteSlotFallback />}>
              <FavoriteSlot placeId={place.id} />
            </Suspense>
          </div>
        </div>
        <aside aria-label="Details" className="flex flex-col gap-lg">
          <PlaceFacts place={place} areaName={areaName} />
          <PlaceMap
            places={toMapPlaces([place], areaNames)}
            linkToPlaces={false}
            label={`Map showing ${place.name}`}
            className="aspect-[4/3] rounded-md"
          />
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("ghost", "self-start px-0! hover:bg-transparent! hover:underline underline-offset-4")}
          >
            <Navigation aria-hidden size={16} strokeWidth={1.5} />
            Directions
            <span className="sr-only"> (opens Google Maps in a new tab)</span>
          </a>
        </aside>
      </Container>

      <Section title="Reviews" muted>
        <div className="grid gap-xl lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-2xl">
          <Suspense fallback={<p className="text-body-sm text-on-surface-variant">Loading reviews…</p>}>
            <Reviews placeId={place.id} />
          </Suspense>
          <Suspense fallback={null}>
            <ReviewComposer placeId={place.id} />
          </Suspense>
        </div>
      </Section>
    </article>
  );
}

/** Reviews change at runtime, so they render per request. */
async function Reviews({ placeId }: { placeId: string }) {
  await connection();
  const [summary, reviews] = await Promise.all([
    container.reviews.getSummary(placeId),
    container.reviews.listForPlace(placeId),
  ]);
  return (
    <div className="flex flex-col gap-xl">
      <RatingSummary summary={summary} />
      <ReviewList reviews={reviews} />
    </div>
  );
}
