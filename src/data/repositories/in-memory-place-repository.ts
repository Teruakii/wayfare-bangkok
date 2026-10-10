import type { Area, AreaId, Place } from "@/domain/entities";
import type { AreaRepository, PlaceQuery, PlaceRepository } from "@/domain/repositories";

export class InMemoryPlaceRepository implements PlaceRepository {
  private readonly places: Place[];

  constructor(seed: Place[] = []) {
    this.places = structuredClone(seed);
  }

  async find(query: PlaceQuery = {}): Promise<Place[]> {
    const text = query.text?.trim().toLowerCase();
    return structuredClone(
      this.places.filter(
        (p) =>
          (!query.type || p.type === query.type) &&
          (!query.areaId || p.location.areaId === query.areaId) &&
          (query.featured === undefined || p.featured === query.featured) &&
          (!text || searchableText(p).includes(text)),
      ),
    );
  }

  async findById(id: string): Promise<Place | null> {
    const place = this.places.find((p) => p.id === id);
    return place ? structuredClone(place) : null;
  }

  async findByIds(ids: string[]): Promise<Place[]> {
    const wanted = new Set(ids);
    return structuredClone(this.places.filter((p) => wanted.has(p.id)));
  }
}

function searchableText(p: Place): string {
  const kind = p.type === "restaurant" ? p.cuisine : p.category;
  return [p.name, p.description, kind, p.location.address].join(" ").toLowerCase();
}

export class InMemoryAreaRepository implements AreaRepository {
  private readonly areas: Area[];

  constructor(seed: Area[] = []) {
    this.areas = structuredClone(seed);
  }

  async findAll(): Promise<Area[]> {
    return structuredClone(this.areas);
  }

  async findById(id: AreaId): Promise<Area | null> {
    const area = this.areas.find((a) => a.id === id);
    return area ? structuredClone(area) : null;
  }
}
