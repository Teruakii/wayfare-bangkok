import { z } from "zod";
import type { Session, User } from "@/domain/entities";
import type { AuthService } from "@/domain/services/auth-service";
import { validate } from "../validate";

const registerSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(60, "Name is too long."),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email.")),
  password: z
    .string()
    .min(8, "Use at least 8 characters.")
    .max(128, "Password is too long."),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email.")),
  password: z.string().min(1, "Enter your password."),
});

type AuthResult = { user: User; session: Session };

export function makeRegister({ auth }: { auth: AuthService }) {
  return async (input: Record<string, unknown>): Promise<AuthResult> =>
    auth.register(validate(registerSchema, input));
}

export function makeLogin({ auth }: { auth: AuthService }) {
  return async (input: Record<string, unknown>): Promise<AuthResult> => {
    const { email, password } = validate(loginSchema, input);
    return auth.login(email, password);
  };
}

export function makeLogout({ auth }: { auth: AuthService }) {
  return (token: string): Promise<void> => auth.logout(token);
}

export function makeGetCurrentUser({ auth }: { auth: AuthService }) {
  return async (token: string | undefined): Promise<User | null> =>
    token ? auth.getUserBySession(token) : null;
}
