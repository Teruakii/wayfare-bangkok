import type { Review } from "@/domain/entities";
import type { NewReview, ReviewRepository } from "@/domain/repositories";

const newestFirst = (a: Review, b: Review) => b.createdAt.getTime() - a.createdAt.getTime();

export class InMemoryReviewRepository implements ReviewRepository {
  private readonly reviews: Review[];

  constructor(seed: Review[] = []) {
    this.reviews = structuredClone(seed);
  }

  async findByPlace(placeId: string): Promise<Review[]> {
    return this.select((r) => r.placeId === placeId);
  }

  async findByUser(userId: string): Promise<Review[]> {
    return this.select((r) => r.userId === userId);
  }

  async findByPlaces(placeIds: string[]): Promise<Review[]> {
    const wanted = new Set(placeIds);
    return this.select((r) => wanted.has(r.placeId));
  }

  async findByUserAndPlace(userId: string, placeId: string): Promise<Review | null> {
    return this.select((r) => r.userId === userId && r.placeId === placeId)[0] ?? null;
  }

  async add(input: NewReview): Promise<Review> {
    const review: Review = { ...input, id: crypto.randomUUID(), createdAt: new Date() };
    this.reviews.push(review);
    return structuredClone(review);
  }

  private select(predicate: (r: Review) => boolean): Review[] {
    return structuredClone(this.reviews.filter(predicate).sort(newestFirst));
  }
}
