import type { Place, PlaceType } from "@/domain/entities";
import { formatPrice, placeKind } from "@/presentation/format";
import type { AreaNames } from "../place";

/** The small, serializable slice of a Place that the client map needs. */
export interface MapPlace {
  id: string;
  name: string;
  type: PlaceType;
  lat: number;
  lng: number;
  /** Pre-formatted meta line, e.g. "Isan · ฿฿ · Silom". */
  meta: string;
}

export function toMapPlaces(places: Place[], areaNames: AreaNames): MapPlace[] {
  return places.map((p) => ({
    id: p.id,
    name: p.name,
    type: p.type,
    lat: p.location.lat,
    lng: p.location.lng,
    meta: [placeKind(p), formatPrice(p), areaNames.get(p.location.areaId)]
      .filter(Boolean)
      .join(" · "),
  }));
}
