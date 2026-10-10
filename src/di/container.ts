/**
 * Composition root: the only file that chooses concrete implementations.
 * To move to a real database or auth provider, change `createStores()` —
 * nothing in domain/ or presentation/ needs to change.
 */
import { MockAuthService } from "@/data/auth/mock-auth-service";
import {
  InMemoryAreaRepository,
  InMemoryFavoriteRepository,
  InMemoryPlaceRepository,
  InMemoryReviewRepository,
  InMemoryUserRepository,
} from "@/data/repositories";
import { sampleAreas } from "@/data/sample/areas";
import { samplePlaces } from "@/data/sample/places";
import { sampleReviews } from "@/data/sample/reviews";
import { DEMO_USER, sampleUsers } from "@/data/sample/users";
import * as auth from "@/domain/use-cases/auth";
import * as favorites from "@/domain/use-cases/favorites";
import * as places from "@/domain/use-cases/places";
import * as reviews from "@/domain/use-cases/reviews";

function createStores() {
  const users = new InMemoryUserRepository(sampleUsers);
  return {
    places: new InMemoryPlaceRepository(samplePlaces),
    areas: new InMemoryAreaRepository(sampleAreas),
    reviews: new InMemoryReviewRepository(sampleReviews),
    favorites: new InMemoryFavoriteRepository(),
    users,
    auth: new MockAuthService(users),
  };
}

type Stores = ReturnType<typeof createStores>;

// Keep in-memory state on globalThis so it survives dev hot reloads.
const globalForStores = globalThis as typeof globalThis & { __wayfareStores?: Stores };
const stores = (globalForStores.__wayfareStores ??= createStores());

export const container = {
  places: {
    list: places.makeListPlaces(stores),
    search: places.makeSearchPlaces(stores),
    getById: places.makeGetPlaceById(stores),
    listAreas: places.makeListAreas(stores),
  },
  reviews: {
    listForPlace: reviews.makeListReviewsForPlace(stores),
    getSummary: reviews.makeGetRatingSummary(stores),
    getSummaries: reviews.makeGetRatingSummaries(stores),
    add: reviews.makeAddReview(stores),
    listMine: reviews.makeListMyReviews(stores),
  },
  favorites: {
    toggle: favorites.makeToggleFavorite(stores),
    isFavorite: favorites.makeIsFavorite(stores),
    listMine: favorites.makeListMyFavorites(stores),
  },
  auth: {
    register: auth.makeRegister(stores),
    login: auth.makeLogin(stores),
    logout: auth.makeLogout(stores),
    getCurrentUser: auth.makeGetCurrentUser(stores),
  },
};

/** Credentials shown on the login page while mock auth is in use. */
export const demoAccount: { email: string; password: string } | null = DEMO_USER;
