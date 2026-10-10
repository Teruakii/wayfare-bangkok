import { z } from "zod";
import type { Place, Rating, RatingSummary, Review } from "@/domain/entities";
import { ConflictError, NotFoundError } from "@/domain/errors";
import type {
  PlaceRepository,
  ReviewRepository,
  UserRepository,
} from "@/domain/repositories";
import { validate } from "../validate";

export function summarize(reviews: Review[]): RatingSummary {
  if (reviews.length === 0) return { average: null, count: 0 };
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return { average: Math.round((total / reviews.length) * 10) / 10, count: reviews.length };
}

export function makeListReviewsForPlace({ reviews }: { reviews: ReviewRepository }) {
  return (placeId: string): Promise<Review[]> => reviews.findByPlace(placeId);
}

export function makeGetRatingSummary({ reviews }: { reviews: ReviewRepository }) {
  return async (placeId: string): Promise<RatingSummary> =>
    summarize(await reviews.findByPlace(placeId));
}

/** Ratings for a list of places in one query, e.g. for a card grid. */
export function makeGetRatingSummaries({ reviews }: { reviews: ReviewRepository }) {
  return async (placeIds: string[]): Promise<Map<string, RatingSummary>> => {
    const all = await reviews.findByPlaces(placeIds);
    return new Map(
      placeIds.map((id) => [id, summarize(all.filter((r) => r.placeId === id))]),
    );
  };
}

const addReviewSchema = z.object({
  rating: z.coerce
    .number()
    .int("Choose a rating from 1 to 5.")
    .min(1, "Choose a rating from 1 to 5.")
    .max(5, "Choose a rating from 1 to 5."),
  comment: z
    .string()
    .trim()
    .min(10, "Write at least 10 characters.")
    .max(1000, "Keep it under 1000 characters."),
});

export interface AddReviewInput {
  userId: string;
  placeId: string;
  rating: unknown;
  comment: unknown;
}

/** One review per user per place. */
export function makeAddReview(deps: {
  reviews: ReviewRepository;
  places: PlaceRepository;
  users: UserRepository;
}) {
  return async (input: AddReviewInput): Promise<Review> => {
    const { rating, comment } = validate(addReviewSchema, input);

    const [place, user] = await Promise.all([
      deps.places.findById(input.placeId),
      deps.users.findById(input.userId),
    ]);
    if (!place) throw new NotFoundError("Place", input.placeId);
    if (!user) throw new NotFoundError("User", input.userId);

    if (await deps.reviews.findByUserAndPlace(user.id, place.id)) {
      throw new ConflictError("You have already reviewed this place.");
    }

    return deps.reviews.add({
      placeId: place.id,
      userId: user.id,
      authorName: user.name,
      rating: rating as Rating,
      comment,
    });
  };
}

export interface MyReview {
  review: Review;
  place: Place;
}

export function makeListMyReviews(deps: {
  reviews: ReviewRepository;
  places: PlaceRepository;
}) {
  return async (userId: string): Promise<MyReview[]> => {
    const mine = await deps.reviews.findByUser(userId);
    const places = await deps.places.findByIds(mine.map((r) => r.placeId));
    const byId = new Map(places.map((p) => [p.id, p]));
    // Skip reviews whose place has been removed.
    return mine.flatMap((review) => {
      const place = byId.get(review.placeId);
      return place ? [{ review, place }] : [];
    });
  };
}
