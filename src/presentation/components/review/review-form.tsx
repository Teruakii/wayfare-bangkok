"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import type { FormState } from "@/presentation/actions/form-state";
import { Alert, Button, Textarea } from "../ui";

type ReviewAction = (prev: FormState, formData: FormData) => Promise<FormState>;

export function ReviewForm({ action }: { action: ReviewAction }) {
  const [state, formAction, pending] = useActionState(action, {} as FormState);
  return (
    <form action={formAction} className="flex flex-col gap-lg" noValidate>
      {state.error && <Alert>{state.error}</Alert>}
      <RatingInput defaultValue={Number(state.values?.rating) || 0} error={state.fieldErrors?.rating} />
      <Textarea
        label="Your review"
        name="comment"
        rows={5}
        maxLength={1000}
        placeholder="What should the next visitor know?"
        defaultValue={state.values?.comment}
        error={state.fieldErrors?.comment}
      />
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Posting…" : "Post review"}
      </Button>
    </form>
  );
}

/** Five radio buttons drawn as stars; keyboard arrows work like any radio group. */
function RatingInput({ defaultValue, error }: { defaultValue: number; error?: string[] }) {
  const [value, setValue] = useState(defaultValue);
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  const errorId = error?.length ? "rating-error" : undefined;

  return (
    <fieldset aria-describedby={errorId}>
      <legend className="mb-xs text-label-md uppercase text-on-surface-variant">Your rating</legend>
      <div className="flex gap-xs" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <label
            key={n}
            onMouseEnter={() => setHover(n)}
            className="cursor-pointer rounded-sm p-[2px] text-on-surface has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary"
          >
            <input
              type="radio"
              name="rating"
              value={n}
              checked={value === n}
              onChange={() => setValue(n)}
              className="sr-only"
            />
            <Star aria-hidden size={28} strokeWidth={1.5} fill={n <= shown ? "currentColor" : "none"} />
            <span className="sr-only">
              {n} {n === 1 ? "star" : "stars"}
            </span>
          </label>
        ))}
      </div>
      {errorId && (
        <p id={errorId} className="mt-xs text-body-sm text-error">
          {error!.join(" ")}
        </p>
      )}
    </fieldset>
  );
}
