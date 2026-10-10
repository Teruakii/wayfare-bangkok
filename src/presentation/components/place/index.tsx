import Image from "next/image";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { connection } from "next/server";
import { Clock, MapPin, Ticket } from "lucide-react";
import type { Area, AreaId, Place } from "@/domain/entities";
import { container } from "@/di/container";
import {
  formatOpeningHours,
  formatPrice,
  placeKind,
  priceLabel,
} from "@/presentation/format";
import { RatingBadge } from "../review";
import { Badge, cx } from "../ui";

export type AreaNames = Map<AreaId, string>;

export function toAreaNames(areas: Area[]): AreaNames {
  return new Map(areas.map((a) => [a.id, a.name]));
}

export function PlaceTypeBadge({ place, className }: { place: Place; className?: string }) {
  return (
    <Badge tone={place.type} className={className}>
      {place.type === "restaurant" ? "Restaurant" : "Attraction"}
    </Badge>
  );
}

/** One quiet metadata line: "Isan · ฿฿ · Silom". */
export function PlaceMeta({ place, areaName }: { place: Place; areaName?: string }) {
  return (
    <p className="text-body-sm text-on-surface-variant">
      {placeKind(place)}
      <span aria-hidden> · </span>
      <span aria-label={priceLabel(place)}>{formatPrice(place)}</span>
      {areaName && (
        <>
          <span aria-hidden> · </span>
          {areaName}
        </>
      )}
    </p>
  );
}

/**
 * Ratings change as people review, so they render at request time while the
 * rest of the card stays in the prerendered shell.
 */
async function PlaceRating({ placeId }: { placeId: string }) {
  await connection();
  return <RatingBadge summary={await container.reviews.getSummary(placeId)} />;
}

export function PlaceCard({ place, areaName }: { place: Place; areaName?: string }) {
  return (
    <Link
      href={`/places/${place.id}`}
      className="group flex flex-col gap-md rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-muted transition-shadow duration-300 group-hover:shadow-hover">
        <Image
          src={place.photo.src}
          alt={place.photo.alt}
          fill
          sizes="(min-width: 1024px) 368px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <PlaceTypeBadge place={place} className="absolute left-md top-md" />
      </div>
      <div className="flex flex-col gap-xs">
        <div className="flex items-baseline justify-between gap-sm">
          <h3 className="text-title-md group-hover:underline underline-offset-4">{place.name}</h3>
          <Suspense fallback={null}>
            <PlaceRating placeId={place.id} />
          </Suspense>
        </div>
        <PlaceMeta place={place} areaName={areaName} />
      </div>
    </Link>
  );
}

/** 1 / 2 / 3 columns — never denser (DESIGN.md). */
export function PlaceGrid({
  places,
  areaNames,
  emptyMessage = "No places match yet.",
}: {
  places: Place[];
  areaNames: AreaNames;
  emptyMessage?: string;
}) {
  if (places.length === 0) {
    return <p className="text-body-md text-on-surface-variant">{emptyMessage}</p>;
  }
  return (
    <ul className="grid grid-cols-1 gap-x-lg gap-y-xl sm:grid-cols-2 lg:grid-cols-3">
      {places.map((place) => (
        <li key={place.id}>
          <PlaceCard place={place} areaName={areaNames.get(place.location.areaId)} />
        </li>
      ))}
    </ul>
  );
}

export function OpeningHours({ place, className }: { place: Place; className?: string }) {
  return (
    <table className={cx("text-body-md", className)}>
      <tbody>
        {formatOpeningHours(place.openingHours).map((row) => (
          <tr key={row.days}>
            <th scope="row" className="pr-lg text-left font-normal text-on-surface-variant">
              {row.days}
            </th>
            <td className={row.hours === "Closed" ? "text-on-surface-variant" : undefined}>
              {row.hours}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Address, price and hours block for the detail page. */
export function PlaceFacts({ place, areaName }: { place: Place; areaName?: string }) {
  return (
    <dl className="flex flex-col gap-lg">
      <Fact icon={<MapPin aria-hidden size={20} strokeWidth={1.5} />} label="Location">
        {areaName && <span className="block">{areaName}</span>}
        <span className="block text-on-surface-variant">{place.location.address}</span>
      </Fact>
      <Fact
        icon={<Ticket aria-hidden size={20} strokeWidth={1.5} />}
        label={place.type === "restaurant" ? "Price" : "Entry"}
      >
        <span aria-label={priceLabel(place)}>{formatPrice(place)}</span>
        {place.price.kind === "level" && (
          <span className="text-on-surface-variant"> · {priceLabel(place)}</span>
        )}
      </Fact>
      <Fact icon={<Clock aria-hidden size={20} strokeWidth={1.5} />} label="Opening hours">
        <OpeningHours place={place} />
      </Fact>
    </dl>
  );
}

function Fact({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-md">
      <span className="mt-[2px] text-on-surface-variant">{icon}</span>
      <div className="flex flex-col gap-xs">
        <dt className="text-label-md uppercase text-on-surface-variant">{label}</dt>
        <dd className="text-body-md">{children}</dd>
      </div>
    </div>
  );
}
