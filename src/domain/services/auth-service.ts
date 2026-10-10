import type { Session, User } from "@/domain/entities";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

/**
 * Authentication boundary. The domain never sees cookies or password hashes;
 * the presentation layer stores `Session.token` however it likes (e.g. an
 * HTTP-only cookie). Swap the mock for a real provider in di/container.ts.
 */
export interface AuthService {
  /** Throws ConflictError if the email is already registered. */
  register(input: RegisterInput): Promise<{ user: User; session: Session }>;
  /** Throws UnauthorizedError on wrong email or password. */
  login(email: string, password: string): Promise<{ user: User; session: Session }>;
  logout(token: string): Promise<void>;
  /** Returns null for unknown or expired tokens. */
  getUserBySession(token: string): Promise<User | null>;
}
