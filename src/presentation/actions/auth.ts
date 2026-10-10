"use server";

import { redirect } from "next/navigation";
import { container } from "@/di/container";
import { ConflictError, UnauthorizedError, ValidationError } from "@/domain/errors";
import {
  clearSessionCookie,
  getSessionToken,
  setSessionCookie,
} from "@/presentation/auth/session";
import { formString, safeNextPath, type FormState } from "./form-state";

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = formString(formData, "email");
  const values = { email };
  try {
    const { session } = await container.auth.login({
      email,
      password: formString(formData, "password"),
    });
    await setSessionCookie(session);
  } catch (error) {
    if (error instanceof ValidationError) return { fieldErrors: error.fieldErrors, values };
    if (error instanceof UnauthorizedError) return { error: error.message, values };
    throw error;
  }
  redirect(safeNextPath(formString(formData, "next")));
}

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = formString(formData, "name");
  const email = formString(formData, "email");
  const values = { name, email };
  try {
    const { session } = await container.auth.register({
      name,
      email,
      password: formString(formData, "password"),
    });
    await setSessionCookie(session);
  } catch (error) {
    if (error instanceof ValidationError) return { fieldErrors: error.fieldErrors, values };
    if (error instanceof ConflictError) {
      return { fieldErrors: { email: [error.message] }, values };
    }
    throw error;
  }
  redirect(safeNextPath(formString(formData, "next")));
}

export async function logoutAction(): Promise<void> {
  const token = await getSessionToken();
  if (token) await container.auth.logout(token);
  await clearSessionCookie();
  redirect("/");
}
