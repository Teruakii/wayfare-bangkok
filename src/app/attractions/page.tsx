import type { Metadata } from "next";
import { BrowsePlaces } from "@/presentation/components/place/browse-places";

export const metadata: Metadata = { title: "Attractions — Wayfare Bangkok" };

export default function AttractionsPage({ searchParams }: PageProps<"/attractions">) {
  return (
    <BrowsePlaces
      type="attraction"
      basePath="/attractions"
      title="Things to see"
      intro="Temples, parks, markets and a view from the top — worth leaving the café for."
      searchParams={searchParams}
    />
  );
}
