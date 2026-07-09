import { ValidationError } from "../../errors/index.js";

export function requireEnum<T extends Record<string, string>>(
  value: unknown,

  enumType: T,

  field: string,
): T[keyof T] {
  if (typeof value !== "string") {
    throw new ValidationError(`${field} must be a string.`);
  }

  const values = Object.values(enumType);

  if (!values.includes(value as T[keyof T])) {
    throw new ValidationError(`${field} has invalid value.`);
  }

  return value as T[keyof T];
}
