"use client";

import { useOptimistic, useTransition } from "react";
import { Bookmark } from "lucide-react";
import { toggleFavoriteAction } from "@/presentation/actions/places";
import { buttonClasses } from "../ui";

/** Save / un-save toggle. Flips instantly, then the server refresh confirms it. */
export function FavoriteButton({ placeId, saved }: { placeId: string; saved: boolean }) {
  const [optimisticSaved, setOptimisticSaved] = useOptimistic(saved);
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      aria-pressed={optimisticSaved}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          setOptimisticSaved(!optimisticSaved);
          await toggleFavoriteAction(placeId);
        })
      }
      className={buttonClasses(
        optimisticSaved ? "ghost" : "primary",
        optimisticSaved ? "border border-primary disabled:opacity-100" : "disabled:opacity-100",
      )}
    >
      <Bookmark aria-hidden size={16} strokeWidth={1.5} fill={optimisticSaved ? "currentColor" : "none"} />
      {optimisticSaved ? "Saved" : "Save place"}
    </button>
  );
}
