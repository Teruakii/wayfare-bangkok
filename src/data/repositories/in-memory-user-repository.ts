import type { User } from "@/domain/entities";
import type { UserRepository } from "@/domain/repositories";
import type { UserRecord } from "@/data/sample/users";

/**
 * Implements the domain UserRepository, plus credential methods that only the
 * mock auth service (data layer) uses.
 */
export class InMemoryUserRepository implements UserRepository {
  private readonly users: UserRecord[];

  constructor(seed: UserRecord[] = []) {
    this.users = structuredClone(seed);
  }

  async findById(id: string): Promise<User | null> {
    return toUser(this.users.find((u) => u.id === id));
  }

  async findByEmail(email: string): Promise<User | null> {
    return toUser(this.findRecord(email));
  }

  async findCredentialsByEmail(email: string): Promise<UserRecord | null> {
    const record = this.findRecord(email);
    return record ? structuredClone(record) : null;
  }

  async create(input: Omit<UserRecord, "id" | "createdAt">): Promise<User> {
    const record: UserRecord = {
      ...input,
      email: input.email.toLowerCase(),
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    this.users.push(record);
    return toUser(record)!;
  }

  private findRecord(email: string): UserRecord | undefined {
    const normalized = email.trim().toLowerCase();
    return this.users.find((u) => u.email === normalized);
  }
}

function toUser(record: UserRecord | undefined): User | null {
  if (!record) return null;
  const { id, name, email, createdAt } = record;
  return structuredClone({ id, name, email, createdAt });
}
