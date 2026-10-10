import { container } from "@/di/container";
import { addReviewAction } from "@/presentation/actions/places";
import { getCurrentUser } from "@/presentation/auth/session";
import { ButtonLink } from "../ui";
import { ReviewForm } from "./review-form";

/** "Write a review" card. Reads the session, so render it inside <Suspense>. */
export async function ReviewComposer({ placeId }: { placeId: string }) {
  const user = await getCurrentUser();

  let body;
  if (!user) {
    body = (
      <>
        <p className="text-body-md text-on-surface-variant">Log in to rate this place and share a tip.</p>
        <ButtonLink
          href={`/login?next=${encodeURIComponent(`/places/${placeId}`)}`}
          variant="ghost"
          className="self-start border border-primary"
        >
          Log in to review
        </ButtonLink>
      </>
    );
  } else {
    const reviews = await container.reviews.listForPlace(placeId);
    body = reviews.some((r) => r.userId === user.id) ? (
      <p className="text-body-md text-on-surface-variant">
        Thanks — your review is posted. You can find it on your dashboard.
      </p>
    ) : (
      <ReviewForm action={addReviewAction.bind(null, placeId)} />
    );
  }

  return (
    <div className="flex flex-col gap-md rounded-lg bg-surface p-lg">
      <h3 className="text-title-md">Been here?</h3>
      {body}
    </div>
  );
}
