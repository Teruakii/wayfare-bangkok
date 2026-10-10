export type Rating = 1 | 2 | 3 | 4 | 5;

export interface Review {
  id: string;
  placeId: string;
  userId: string;
  /** Display name captured when the review was written. */
  authorName: string;
  rating: Rating;
  comment: string;
  createdAt: Date;
}

export interface RatingSummary {
  /** Mean rating rounded to one decimal, or null when there are no reviews. */
  average: number | null;
  count: number;
}
