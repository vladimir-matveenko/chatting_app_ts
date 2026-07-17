import { ValidationError } from "../../errors/index.js";
import { StringValidationOptions } from "./string-validation-options.js";

export function requireString(
  value: unknown,

  field: string,

  options?: StringValidationOptions,
): string {
  if (typeof value !== "string") {
    throw new ValidationError(`${field} must be a string.`);
  }

  const result = value.trim();

  if (result.length === 0) {
    throw new ValidationError(`${field} is required.`);
  }

  if (options?.minLength !== undefined && result.length < options?.minLength) {
    throw new ValidationError(`${field} must contain at least ${options?.minLength} characters.`);
  }

  if (options?.maxLength !== undefined && result.length > options?.maxLength) {
    throw new ValidationError(`${field} must not exceed ${options?.maxLength} characters.`);
  }

  return result;
}
