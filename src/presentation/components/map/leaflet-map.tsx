"use client";

import "leaflet/dist/leaflet.css";
import "./map.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import type { PlaceType } from "@/domain/entities";
import type { MapPlace } from "./map-place";

// Standard OpenStreetMap tiles (no API key), shown in grayscale via map.css.
// OSM's tile policy only allows light use — switch to a tile provider before launch.
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const BANGKOK: L.LatLngTuple = [13.7467, 100.5349];

function pin(type: PlaceType): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<span class="wf-pin wf-pin--${type}"></span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

/** Popup built from DOM nodes (textContent), so place data is never parsed as HTML. */
function popupContent(place: MapPlace, linkToPlaces: boolean): HTMLElement {
  const root = document.createElement("div");
  root.className = "flex flex-col gap-xs";

  const kind = document.createElement("span");
  kind.className = "text-label-md uppercase text-on-surface-variant";
  kind.textContent = place.type === "restaurant" ? "Restaurant" : "Attraction";

  const name = document.createElement(linkToPlaces ? "a" : "span");
  name.className = "text-title-md text-on-surface hover:underline underline-offset-4";
  name.textContent = place.name;
  if (name instanceof HTMLAnchorElement) name.href = `/places/${encodeURIComponent(place.id)}`;

  const meta = document.createElement("span");
  meta.className = "text-body-sm text-on-surface-variant";
  meta.textContent = place.meta;

  root.append(kind, name, meta);
  return root;
}

export interface LeafletMapProps {
  places: MapPlace[];
  /** Embedded maps leave scroll-wheel zoom off so the page still scrolls. */
  scrollWheelZoom?: boolean;
  /** Hide the popup link when the map already sits on the place's own page. */
  linkToPlaces?: boolean;
}

/**
 * Leaflet driven directly from an effect. The cleanup calls map.remove(), so
 * the map can be torn down and rebuilt safely — Next.js keeps visited routes
 * in hidden <Activity> boundaries, which re-runs effects when you navigate back.
 */
export default function LeafletMap({
  places,
  scrollWheelZoom = false,
  linkToPlaces = true,
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Server refreshes hand us a new array each time; only rebuild when the content changes.
  const placesKey = JSON.stringify(places);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const places: MapPlace[] = JSON.parse(placesKey);

    const map = L.map(el, { scrollWheelZoom });
    L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map);

    for (const place of places) {
      L.marker([place.lat, place.lng], {
        icon: pin(place.type),
        title: place.name,
        alt: place.name,
      })
        .bindPopup(() => popupContent(place, linkToPlaces))
        .addTo(map);
    }

    if (places.length === 1) {
      map.setView([places[0].lat, places[0].lng], 15);
    } else if (places.length > 1) {
      map.fitBounds(L.latLngBounds(places.map((p) => [p.lat, p.lng])), { padding: [40, 40] });
    } else {
      map.setView(BANGKOK, 12);
    }

    return () => {
      map.remove();
    };
  }, [placesKey, scrollWheelZoom, linkToPlaces]);

  return <div ref={containerRef} className="h-full w-full" />;
}
