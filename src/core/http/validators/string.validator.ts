import { ValidationError } from "../../errors/index.js";

export function requireString(value: unknown, field: string): string {
  if (typeof value !== "string") {
    throw new ValidationError(`${field} must be a string.`);
  }

  const result = value.trim();

  if (result.length === 0) {
    throw new ValidationError(`${field} is required.`);
  }

  return result;
}
