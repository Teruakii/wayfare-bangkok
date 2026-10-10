import type { FieldErrors } from "@/domain/errors";

/** What a form's Server Action hands back to useActionState. */
export interface FormState {
  /** Form-level message, shown in an Alert. */
  error?: string;
  fieldErrors?: FieldErrors;
  /** Echoed values so fields keep their input after a failed submit. */
  values?: Record<string, string>;
  /** Set when the action succeeded and the form should reset. */
  ok?: boolean;
}

export function formString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

/** Only allow same-site relative paths, so ?next= can't redirect off-site. */
export function safeNextPath(value: string, fallback = "/dashboard"): string {
  return value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\")
    ? value
    : fallback;
}
