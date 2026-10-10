import { describe, expect, it } from "vitest";
import { MockAuthService } from "@/data/auth/mock-auth-service";
import { InMemoryUserRepository } from "@/data/repositories";
import { DEMO_USER, sampleUsers } from "@/data/sample/users";
import { ConflictError, UnauthorizedError } from "@/domain/errors";

const setup = (ttlMs?: number) => new MockAuthService(new InMemoryUserRepository(sampleUsers), ttlMs);

describe("MockAuthService", () => {
  it("logs in the demo user and resolves the session", async () => {
    const auth = setup();
    const { user, session } = await auth.login(DEMO_USER.email, DEMO_USER.password);
    expect(user.name).toBe("Demo Traveler");
    expect(user).not.toHaveProperty("passwordHash");
    expect(await auth.getUserBySession(session.token)).toEqual(user);
  });

  it("rejects a wrong password or unknown email with the same error", async () => {
    const auth = setup();
    const a = await auth.login(DEMO_USER.email, "wrong-password").catch((e) => e);
    const b = await auth.login("nobody@example.com", "wayfare123").catch((e) => e);
    expect(a).toBeInstanceOf(UnauthorizedError);
    expect(b.message).toBe(a.message);
  });

  it("registers a new user who can then log in", async () => {
    const auth = setup();
    await auth.register({ name: "Ann", email: "ann@example.com", password: "longenough" });
    const { user } = await auth.login("ann@example.com", "longenough");
    expect(user.name).toBe("Ann");
  });

  it("refuses a duplicate email", async () => {
    const auth = setup();
    await expect(
      auth.register({ name: "X", email: DEMO_USER.email, password: "longenough" }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("ends sessions on logout and on expiry", async () => {
    const auth = setup();
    const { session } = await auth.login(DEMO_USER.email, DEMO_USER.password);
    await auth.logout(session.token);
    expect(await auth.getUserBySession(session.token)).toBeNull();

    const expired = setup(-1);
    const { session: old } = await expired.login(DEMO_USER.email, DEMO_USER.password);
    expect(await expired.getUserBySession(old.token)).toBeNull();
  });
});
