export const PLACE_TYPES = ["restaurant", "attraction"] as const;
export type PlaceType = (typeof PLACE_TYPES)[number];

export const AREA_IDS = [
  "rattanakosin",
  "chinatown",
  "silom",
  "sukhumvit",
  "thonglor",
  "ari-chatuchak",
] as const;
export type AreaId = (typeof AREA_IDS)[number];

export interface Area {
  id: AreaId;
  name: string;
  description: string;
}

export interface Location {
  areaId: AreaId;
  address: string;
  lat: number;
  lng: number;
}

/** 0 = Sunday … 6 = Saturday (same as Date#getDay). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * One opening window in local Bangkok time, "HH:MM" 24h.
 * `closes` earlier than `opens` means the window runs past midnight.
 */
export interface OpeningPeriod {
  day: Weekday;
  opens: string;
  closes: string;
}

export interface Photo {
  src: string;
  alt: string;
}

/** Restaurants are priced by level: 1 = cheap eats … 4 = splurge. */
export interface PriceLevel {
  kind: "level";
  level: 1 | 2 | 3 | 4;
}

/** Attractions have an entry fee in Thai baht; 0 means free. */
export interface EntryFee {
  kind: "fee";
  amountThb: number;
}

interface PlaceBase {
  /** URL-safe, human-readable id, e.g. "jay-fai". */
  id: string;
  name: string;
  photo: Photo;
  description: string;
  location: Location;
  openingHours: OpeningPeriod[];
  featured: boolean;
}

export interface Restaurant extends PlaceBase {
  type: "restaurant";
  cuisine: string;
  price: PriceLevel;
}

export interface Attraction extends PlaceBase {
  type: "attraction";
  category: string;
  price: EntryFee;
}

export type Place = Restaurant | Attraction;

export function isAreaId(value: unknown): value is AreaId {
  return typeof value === "string" && (AREA_IDS as readonly string[]).includes(value);
}

export function isPlaceType(value: unknown): value is PlaceType {
  return typeof value === "string" && (PLACE_TYPES as readonly string[]).includes(value);
}
