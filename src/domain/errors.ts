export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class NotFoundError extends DomainError {
  constructor(entity: string, id: string) {
    super(`${entity} "${id}" was not found.`);
  }
}

export type FieldErrors = Record<string, string[]>;

export class ValidationError extends DomainError {
  constructor(
    public readonly fieldErrors: FieldErrors,
    message = "Some fields are invalid.",
  ) {
    super(message);
  }
}

export class ConflictError extends DomainError {}

/** Wrong credentials or a missing/expired session. */
export class UnauthorizedError extends DomainError {}
