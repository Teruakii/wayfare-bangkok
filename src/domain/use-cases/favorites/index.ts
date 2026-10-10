import type { Place } from "@/domain/entities";
import { NotFoundError } from "@/domain/errors";
import type { FavoriteRepository, PlaceRepository } from "@/domain/repositories";

export function makeToggleFavorite(deps: {
  favorites: FavoriteRepository;
  places: PlaceRepository;
}) {
  /** Saves the place if it isn't saved yet, otherwise un-saves it. */
  return async (userId: string, placeId: string): Promise<{ saved: boolean }> => {
    if (!(await deps.places.findById(placeId))) throw new NotFoundError("Place", placeId);

    if (await deps.favorites.has(userId, placeId)) {
      await deps.favorites.remove(userId, placeId);
      return { saved: false };
    }
    await deps.favorites.add(userId, placeId);
    return { saved: true };
  };
}

export function makeIsFavorite({ favorites }: { favorites: FavoriteRepository }) {
  return (userId: string, placeId: string): Promise<boolean> =>
    favorites.has(userId, placeId);
}

export function makeListMyFavorites(deps: {
  favorites: FavoriteRepository;
  places: PlaceRepository;
}) {
  /** Saved places, most recently saved first. */
  return async (userId: string): Promise<Place[]> => {
    const ids = await deps.favorites.listPlaceIds(userId);
    const places = await deps.places.findByIds(ids);
    const byId = new Map(places.map((p) => [p.id, p]));
    return ids.flatMap((id) => byId.get(id) ?? []);
  };
}
