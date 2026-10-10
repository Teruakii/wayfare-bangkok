import type {
  Area,
  AreaId,
  Place,
  PlaceType,
  Rating,
  Review,
  User,
} from "@/domain/entities";

/** All fields are optional and combined with AND. */
export interface PlaceQuery {
  /** Case-insensitive match on name, description, cuisine or category. */
  text?: string;
  type?: PlaceType;
  areaId?: AreaId;
  featured?: boolean;
}

export interface PlaceRepository {
  find(query?: PlaceQuery): Promise<Place[]>;
  findById(id: string): Promise<Place | null>;
  findByIds(ids: string[]): Promise<Place[]>;
}

export interface AreaRepository {
  findAll(): Promise<Area[]>;
  findById(id: AreaId): Promise<Area | null>;
}

export interface NewReview {
  placeId: string;
  userId: string;
  authorName: string;
  rating: Rating;
  comment: string;
}

export interface ReviewRepository {
  /** Newest first. */
  findByPlace(placeId: string): Promise<Review[]>;
  /** Newest first. */
  findByUser(userId: string): Promise<Review[]>;
  findByPlaces(placeIds: string[]): Promise<Review[]>;
  findByUserAndPlace(userId: string, placeId: string): Promise<Review | null>;
  add(review: NewReview): Promise<Review>;
}

export interface FavoriteRepository {
  add(userId: string, placeId: string): Promise<void>;
  remove(userId: string, placeId: string): Promise<void>;
  has(userId: string, placeId: string): Promise<boolean>;
  /** Most recently saved first. */
  listPlaceIds(userId: string): Promise<string[]>;
}

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}
