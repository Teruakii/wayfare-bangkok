import type { FavoriteRepository } from "@/domain/repositories";

export class InMemoryFavoriteRepository implements FavoriteRepository {
  /** userId -> placeIds in insertion order (oldest first). */
  private readonly byUser = new Map<string, Set<string>>();

  constructor(seed: { userId: string; placeId: string }[] = []) {
    for (const { userId, placeId } of seed) this.saved(userId).add(placeId);
  }

  async add(userId: string, placeId: string): Promise<void> {
    this.saved(userId).add(placeId);
  }

  async remove(userId: string, placeId: string): Promise<void> {
    this.byUser.get(userId)?.delete(placeId);
  }

  async has(userId: string, placeId: string): Promise<boolean> {
    return this.byUser.get(userId)?.has(placeId) ?? false;
  }

  async listPlaceIds(userId: string): Promise<string[]> {
    return [...(this.byUser.get(userId) ?? [])].reverse();
  }

  private saved(userId: string): Set<string> {
    let set = this.byUser.get(userId);
    if (!set) this.byUser.set(userId, (set = new Set()));
    return set;
  }
}
