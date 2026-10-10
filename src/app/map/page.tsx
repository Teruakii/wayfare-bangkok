import type { Metadata } from "next";
import { container } from "@/di/container";
import { MapLegend, PlaceMap } from "@/presentation/components/map";
import { toMapPlaces } from "@/presentation/components/map/map-place";
import { toAreaNames } from "@/presentation/components/place";
import { Container } from "@/presentation/components/ui";

export const metadata: Metadata = { title: "Map — Wayfare Bangkok" };

export default async function MapPage() {
  const [places, areas] = await Promise.all([
    container.places.list(),
    container.places.listAreas(),
  ]);

  return (
    <Container className="flex flex-col gap-lg py-xl md:py-2xl">
      <div className="flex flex-col gap-md md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-serif text-headline-lg md:text-display">Bangkok on a map</h1>
          <p className="mt-sm text-body-lg text-on-surface-variant">
            Tap a pin to see the place.
          </p>
        </div>
        <MapLegend />
      </div>
      <PlaceMap
        places={toMapPlaces(places, toAreaNames(areas))}
        scrollWheelZoom
        label="Map of all places"
        className="h-[70vh] min-h-[420px] rounded-lg"
      />
    </Container>
  );
}
