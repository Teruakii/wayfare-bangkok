import type { User } from "@/domain/entities";

/** Data-layer user record: the domain `User` never exposes the password hash. */
export interface UserRecord extends User {
  passwordHash: string;
}

/** bcrypt hash of "wayfare123" — the password for every sample account. */
const SAMPLE_PASSWORD_HASH = "$2b$10$25EUqNCga21FvmZJmO4bt.eZvMlqIuuRaj2/JlRzrjTNhxCdHzZd2";

export const DEMO_USER = { email: "demo@wayfare.app", password: "wayfare123" } as const;

export const sampleUsers: UserRecord[] = [
  {
    id: "user-demo",
    name: "Demo Traveler",
    email: DEMO_USER.email,
    passwordHash: SAMPLE_PASSWORD_HASH,
    createdAt: new Date("2026-01-05T09:00:00Z"),
  },
  {
    id: "user-mali",
    name: "Mali S.",
    email: "mali@example.com",
    passwordHash: SAMPLE_PASSWORD_HASH,
    createdAt: new Date("2026-02-11T12:00:00Z"),
  },
  {
    id: "user-tom",
    name: "Tom R.",
    email: "tom@example.com",
    passwordHash: SAMPLE_PASSWORD_HASH,
    createdAt: new Date("2026-03-20T15:30:00Z"),
  },
];
