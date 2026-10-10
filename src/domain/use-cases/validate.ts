import type { z } from "zod";
import { ValidationError, type FieldErrors } from "@/domain/errors";

/** Parses input with a zod schema, throwing a ValidationError keyed by field. */
export function validate<T extends z.ZodType>(schema: T, input: unknown): z.output<T> {
  const result = schema.safeParse(input);
  if (result.success) return result.data;

  const fieldErrors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path.join(".") || "_form";
    (fieldErrors[field] ??= []).push(issue.message);
  }
  throw new ValidationError(fieldErrors);
}
