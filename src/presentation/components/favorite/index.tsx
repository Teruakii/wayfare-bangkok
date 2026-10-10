import { Bookmark } from "lucide-react";
import { container } from "@/di/container";
import { getCurrentUser } from "@/presentation/auth/session";
import { ButtonLink, buttonClasses } from "../ui";
import { FavoriteButton } from "./favorite-button";

/** Reads the session, so render it inside <Suspense fallback={<FavoriteSlotFallback />}>. */
export async function FavoriteSlot({ placeId }: { placeId: string }) {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <ButtonLink href={`/login?next=${encodeURIComponent(`/places/${placeId}`)}`}>
        <Bookmark aria-hidden size={16} strokeWidth={1.5} />
        Save place
      </ButtonLink>
    );
  }
  const saved = await container.favorites.isFavorite(user.id, placeId);
  return <FavoriteButton placeId={placeId} saved={saved} />;
}

export function FavoriteSlotFallback() {
  return (
    <span aria-hidden className={buttonClasses("primary", "pointer-events-none opacity-50")}>
      <Bookmark size={16} strokeWidth={1.5} />
      Save place
    </span>
  );
}
