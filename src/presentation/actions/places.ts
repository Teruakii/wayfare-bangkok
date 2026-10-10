"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { container } from "@/di/container";
import type { User } from "@/domain/entities";
import { ConflictError, NotFoundError, ValidationError } from "@/domain/errors";
import { getCurrentUser } from "@/presentation/auth/session";
import { formString, type FormState } from "./form-state";

/** Server Actions are public POST endpoints: always re-check the session. */
async function userOrLogin(placeId: string): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/places/${placeId}`)}`);
  return user;
}

export async function toggleFavoriteAction(placeId: string): Promise<{ saved: boolean }> {
  const user = await userOrLogin(placeId);
  const result = await container.favorites.toggle(user.id, String(placeId));
  refresh();
  return result;
}

export async function addReviewAction(
  placeId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await userOrLogin(placeId);
  const values = {
    rating: formString(formData, "rating"),
    comment: formString(formData, "comment"),
  };
  try {
    await container.reviews.add({ userId: user.id, placeId: String(placeId), ...values });
  } catch (error) {
    if (error instanceof ValidationError) return { fieldErrors: error.fieldErrors, values };
    if (error instanceof ConflictError) return { error: error.message, values };
    if (error instanceof NotFoundError) return { error: "This place no longer exists." };
    throw error;
  }
  refresh();
  return { ok: true };
}
