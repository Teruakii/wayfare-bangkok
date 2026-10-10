import { z } from "zod";
import { AREA_IDS, PLACE_TYPES, type Area, type Place } from "@/domain/entities";
import { NotFoundError } from "@/domain/errors";
import type { AreaRepository, PlaceQuery, PlaceRepository } from "@/domain/repositories";
import { validate } from "../validate";

/** Accepts raw values (e.g. URL search params); blank strings mean "no filter". */
const placeQuerySchema = z.object({
  text: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().max(100, "Search is too long.").optional(),
  ),
  type: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.enum(PLACE_TYPES, { error: "Unknown place type." }).optional(),
  ),
  areaId: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.enum(AREA_IDS, { error: "Unknown area." }).optional(),
  ),
  featured: z.boolean().optional(),
});

const byName = (a: Place, b: Place) => a.name.localeCompare(b.name);

export function makeListPlaces({ places }: { places: PlaceRepository }) {
  /** Browse by type and/or area, e.g. the Restaurants page. */
  return async (query: Omit<PlaceQuery, "text"> = {}): Promise<Place[]> => {
    const q: PlaceQuery = validate(placeQuerySchema, query);
    return (await places.find(q)).sort(byName);
  };
}

export function makeSearchPlaces({ places }: { places: PlaceRepository }) {
  /** Free-text search plus filters. Unknown filter values throw ValidationError. */
  return async (query: Record<string, unknown>): Promise<Place[]> => {
    const q: PlaceQuery = validate(placeQuerySchema, query);
    return (await places.find(q)).sort(byName);
  };
}

export function makeGetPlaceById({ places }: { places: PlaceRepository }) {
  return async (id: string): Promise<Place> => {
    const place = await places.findById(id);
    if (!place) throw new NotFoundError("Place", id);
    return place;
  };
}

export function makeListAreas({ areas }: { areas: AreaRepository }) {
  return (): Promise<Area[]> => areas.findAll();
}
