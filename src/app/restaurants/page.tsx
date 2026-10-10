import type { Metadata } from "next";
import { BrowsePlaces } from "@/presentation/components/place/browse-places";

export const metadata: Metadata = { title: "Restaurants — Wayfare Bangkok" };

export default function RestaurantsPage({ searchParams }: PageProps<"/restaurants">) {
  return (
    <BrowsePlaces
      type="restaurant"
      basePath="/restaurants"
      title="Where to eat"
      intro="From charcoal-fired street woks to quiet family dining rooms — the places we'd send a friend."
      searchParams={searchParams}
    />
  );
}
