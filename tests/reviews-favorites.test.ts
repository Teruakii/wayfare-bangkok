import { beforeEach, describe, expect, it } from "vitest";
import {
  InMemoryFavoriteRepository,
  InMemoryPlaceRepository,
  InMemoryReviewRepository,
  InMemoryUserRepository,
} from "@/data/repositories";
import { samplePlaces } from "@/data/sample/places";
import { sampleReviews } from "@/data/sample/reviews";
import { sampleUsers } from "@/data/sample/users";
import { ConflictError, NotFoundError, ValidationError } from "@/domain/errors";
import {
  makeIsFavorite,
  makeListMyFavorites,
  makeToggleFavorite,
} from "@/domain/use-cases/favorites";
import {
  makeAddReview,
  makeGetRatingSummaries,
  makeGetRatingSummary,
  makeListMyReviews,
  makeListReviewsForPlace,
} from "@/domain/use-cases/reviews";

function setup() {
  const deps = {
    places: new InMemoryPlaceRepository(samplePlaces),
    reviews: new InMemoryReviewRepository(sampleReviews),
    users: new InMemoryUserRepository(sampleUsers),
    favorites: new InMemoryFavoriteRepository(),
  };
  return {
    addReview: makeAddReview(deps),
    listReviewsForPlace: makeListReviewsForPlace(deps),
    getRatingSummary: makeGetRatingSummary(deps),
    getRatingSummaries: makeGetRatingSummaries(deps),
    listMyReviews: makeListMyReviews(deps),
    toggleFavorite: makeToggleFavorite(deps),
    isFavorite: makeIsFavorite(deps),
    listMyFavorites: makeListMyFavorites(deps),
  };
}

let uc: ReturnType<typeof setup>;
beforeEach(() => {
  uc = setup();
});

describe("reviews", () => {
  it("lists a place's reviews newest first", async () => {
    const reviews = await uc.listReviewsForPlace("jay-fai");
    expect(reviews.map((r) => r.id)).toEqual(["review-2", "review-1"]);
  });

  it("summarizes ratings, null average when there are none", async () => {
    expect(await uc.getRatingSummary("jay-fai")).toEqual({ average: 4.5, count: 2 });
    expect(await uc.getRatingSummary("lay-lao")).toEqual({ average: null, count: 0 });

    const many = await uc.getRatingSummaries(["grand-palace", "lay-lao"]);
    expect(many.get("grand-palace")).toEqual({ average: 4.5, count: 2 });
    expect(many.get("lay-lao")?.count).toBe(0);
  });

  it("adds a review with the user's name and updates the summary", async () => {
    const review = await uc.addReview({
      userId: "user-demo",
      placeId: "lay-lao",
      rating: "5",
      comment: "  Crispy fish was excellent.  ",
    });
    expect(review).toMatchObject({ authorName: "Demo Traveler", rating: 5, comment: "Crispy fish was excellent." });
    expect(await uc.getRatingSummary("lay-lao")).toEqual({ average: 5, count: 1 });
  });

  it("validates rating and comment", async () => {
    const err = await uc
      .addReview({ userId: "user-demo", placeId: "lay-lao", rating: 7, comment: "short" })
      .catch((e) => e);
    expect(err).toBeInstanceOf(ValidationError);
    expect(Object.keys(err.fieldErrors).sort()).toEqual(["comment", "rating"]);
  });

  it("allows one review per user per place", async () => {
    await expect(
      uc.addReview({ userId: "user-demo", placeId: "grand-palace", rating: 3, comment: "Second try at a review." }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("rejects unknown places", async () => {
    await expect(
      uc.addReview({ userId: "user-demo", placeId: "nope", rating: 3, comment: "This place does not exist." }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("lists my reviews with their places", async () => {
    const mine = await uc.listMyReviews("user-demo");
    expect(mine.map((m) => m.place.id)).toEqual([
      "chatuchak-weekend-market",
      "supanniga-eating-room",
      "grand-palace",
    ]);
  });
});

describe("favorites", () => {
  it("toggles a favorite on and off", async () => {
    expect(await uc.toggleFavorite("user-demo", "wat-pho")).toEqual({ saved: true });
    expect(await uc.isFavorite("user-demo", "wat-pho")).toBe(true);
    expect(await uc.toggleFavorite("user-demo", "wat-pho")).toEqual({ saved: false });
    expect(await uc.isFavorite("user-demo", "wat-pho")).toBe(false);
  });

  it("lists saved places most recent first, per user", async () => {
    await uc.toggleFavorite("user-demo", "wat-pho");
    await uc.toggleFavorite("user-demo", "jay-fai");
    expect((await uc.listMyFavorites("user-demo")).map((p) => p.id)).toEqual(["jay-fai", "wat-pho"]);
    expect(await uc.listMyFavorites("user-tom")).toEqual([]);
  });

  it("rejects unknown places", async () => {
    await expect(uc.toggleFavorite("user-demo", "nope")).rejects.toBeInstanceOf(NotFoundError);
  });
});
