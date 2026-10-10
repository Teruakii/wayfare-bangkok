import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import type { Session, User } from "@/domain/entities";
import { ConflictError, UnauthorizedError } from "@/domain/errors";
import type { AuthService, RegisterInput } from "@/domain/services/auth-service";
import type { InMemoryUserRepository } from "@/data/repositories";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Development-only auth: users and sessions live in memory and are lost on
 * restart. Passwords are still bcrypt-hashed so the flow matches real auth.
 * Replace with a real provider (e.g. Auth.js) by implementing AuthService.
 */
export class MockAuthService implements AuthService {
  private readonly sessions = new Map<string, Session>();

  constructor(
    private readonly users: InMemoryUserRepository,
    private readonly sessionTtlMs = SEVEN_DAYS_MS,
  ) {}

  async register({ name, email, password }: RegisterInput) {
    if (await this.users.findByEmail(email)) {
      throw new ConflictError("An account with this email already exists.");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.users.create({ name, email, passwordHash });
    return { user, session: this.createSession(user) };
  }

  async login(email: string, password: string) {
    const record = await this.users.findCredentialsByEmail(email);
    // Same error for unknown email and wrong password, so accounts can't be probed.
    if (!record || !(await bcrypt.compare(password, record.passwordHash))) {
      throw new UnauthorizedError("Email or password is incorrect.");
    }
    const user = (await this.users.findById(record.id))!;
    return { user, session: this.createSession(user) };
  }

  async logout(token: string): Promise<void> {
    this.sessions.delete(token);
  }

  async getUserBySession(token: string): Promise<User | null> {
    const session = this.sessions.get(token);
    if (!session) return null;
    if (session.expiresAt.getTime() <= Date.now()) {
      this.sessions.delete(token);
      return null;
    }
    return this.users.findById(session.userId);
  }

  private createSession(user: User): Session {
    const session: Session = {
      token: randomBytes(32).toString("base64url"),
      userId: user.id,
      expiresAt: new Date(Date.now() + this.sessionTtlMs),
    };
    this.sessions.set(session.token, session);
    return session;
  }
}
