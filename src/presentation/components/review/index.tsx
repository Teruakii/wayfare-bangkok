import { Star } from "lucide-react";
import type { RatingSummary as Summary, Review } from "@/domain/entities";
import { formatReviewDate } from "@/presentation/format";
import { Divider } from "../ui";

/** Five outline/filled stars in on-surface — DESIGN.md: no accent color for ratings. */
export function StarRating({ value, size = 16 }: { value: number; size?: number }) {
  const rounded = Math.round(value);
  return (
    <span role="img" aria-label={`Rated ${value} out of 5`} className="inline-flex gap-[2px] text-on-surface">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden
          size={size}
          strokeWidth={1.5}
          fill={n <= rounded ? "currentColor" : "none"}
        />
      ))}
    </span>
  );
}

/** Compact "★ 4.5 (2)" for cards; renders nothing when there are no reviews. */
export function RatingBadge({ summary }: { summary: Summary }) {
  if (summary.average === null) return null;
  return (
    <span
      className="inline-flex items-center gap-xs text-body-sm text-on-surface"
      aria-label={`Average rating ${summary.average} from ${summary.count} ${summary.count === 1 ? "review" : "reviews"}`}
    >
      <Star aria-hidden size={14} strokeWidth={1.5} fill="currentColor" />
      {summary.average.toFixed(1)}
      <span className="text-on-surface-variant">({summary.count})</span>
    </span>
  );
}

/** Larger summary for the detail page. */
export function RatingSummary({ summary }: { summary: Summary }) {
  if (summary.average === null) {
    return <p className="text-body-md text-on-surface-variant">No reviews yet.</p>;
  }
  return (
    <div className="flex items-center gap-sm">
      <span className="font-serif text-headline-md">{summary.average.toFixed(1)}</span>
      <StarRating value={summary.average} />
      <span className="text-body-sm text-on-surface-variant">
        {summary.count} {summary.count === 1 ? "review" : "reviews"}
      </span>
    </div>
  );
}

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-body-md text-on-surface-variant">
        Be the first to share what you thought.
      </p>
    );
  }
  return (
    <ul>
      {reviews.map((review, i) => (
        <li key={review.id}>
          {i > 0 && <Divider className="my-lg" />}
          <article className="flex flex-col gap-sm">
            <div className="flex flex-wrap items-center gap-x-md gap-y-xs">
              <span className="text-title-md">{review.authorName}</span>
              <StarRating value={review.rating} size={14} />
              <time
                dateTime={review.createdAt.toISOString()}
                className="text-body-sm text-on-surface-variant"
              >
                {formatReviewDate(review.createdAt)}
              </time>
            </div>
            <p className="max-w-[720px] text-body-md">{review.comment}</p>
          </article>
        </li>
      ))}
    </ul>
  );
}
