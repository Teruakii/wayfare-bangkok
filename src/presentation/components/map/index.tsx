"use client";

import dynamic from "next/dynamic";
import { cx } from "../ui";
import type { LeafletMapProps } from "./leaflet-map";

// Leaflet touches `window`, so it only loads in the browser.
const LeafletMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-surface-muted" />,
});

export function PlaceMap({
  className,
  label = "Map of places",
  ...props
}: LeafletMapProps & { className?: string; label?: string }) {
  return (
    <div
      role="region"
      aria-label={label}
      className={cx("relative isolate overflow-hidden bg-surface-muted", className)}
    >
      <LeafletMap {...props} />
    </div>
  );
}

export function MapLegend({ className }: { className?: string }) {
  return (
    <ul className={cx("flex flex-wrap gap-lg text-body-sm text-on-surface-variant", className)}>
      <li className="flex items-center gap-sm">
        <span aria-hidden className="size-3 rounded-full bg-secondary" /> Restaurants
      </li>
      <li className="flex items-center gap-sm">
        <span aria-hidden className="size-3 rounded-full bg-primary" /> Attractions
      </li>
    </ul>
  );
}
