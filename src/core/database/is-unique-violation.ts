import type { DatabaseError } from "pg";

export function isUniqueViolation(error: unknown): error is DatabaseError {
  return (
    !!error &&
    typeof error === "object" &&
    "code" in error &&
    (error as DatabaseError).code === "23505"
  );
}
