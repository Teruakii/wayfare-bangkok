import { describe, expect, it, vi } from "vitest";
import type { User } from "@/domain/entities";
import { ValidationError } from "@/domain/errors";
import type { AuthService } from "@/domain/services/auth-service";
import {
  makeGetCurrentUser,
  makeLogin,
  makeLogout,
  makeRegister,
} from "@/domain/use-cases/auth";

// The mock auth service arrives in step 6; here we only test the use-case rules.
const user: User = { id: "u1", name: "Ann", email: "ann@example.com", createdAt: new Date() };
const session = { token: "t1", userId: "u1", expiresAt: new Date() };

function fakeAuth(): AuthService {
  return {
    register: vi.fn(async () => ({ user, session })),
    login: vi.fn(async () => ({ user, session })),
    logout: vi.fn(async () => {}),
    getUserBySession: vi.fn(async (token: string) => (token === "t1" ? user : null)),
  };
}

describe("auth use cases", () => {
  it("normalizes input before registering", async () => {
    const auth = fakeAuth();
    await makeRegister({ auth })({ name: " Ann ", email: " ANN@Example.com ", password: "longenough" });
    expect(auth.register).toHaveBeenCalledWith({
      name: "Ann",
      email: "ann@example.com",
      password: "longenough",
    });
  });

  it("rejects bad registration input without calling the service", async () => {
    const auth = fakeAuth();
    const err = await makeRegister({ auth })({ name: "", email: "nope", password: "short" }).catch((e) => e);
    expect(err).toBeInstanceOf(ValidationError);
    expect(Object.keys(err.fieldErrors).sort()).toEqual(["email", "name", "password"]);
    expect(auth.register).not.toHaveBeenCalled();
  });

  it("logs in with a normalized email", async () => {
    const auth = fakeAuth();
    await makeLogin({ auth })({ email: "Ann@Example.com", password: "x" });
    expect(auth.login).toHaveBeenCalledWith("ann@example.com", "x");
  });

  it("resolves the current user from a token", async () => {
    const auth = fakeAuth();
    const getCurrentUser = makeGetCurrentUser({ auth });
    expect(await getCurrentUser("t1")).toEqual(user);
    expect(await getCurrentUser("bad")).toBeNull();
    expect(await getCurrentUser(undefined)).toBeNull();
    await makeLogout({ auth })("t1");
    expect(auth.logout).toHaveBeenCalledWith("t1");
  });
});
