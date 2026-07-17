import { StringValidationOptions } from "./string-validation-options.js";
import { requireString } from "./string.validator.js";

export function requireNullableString(
  value: unknown,

  field: string,

  options?: StringValidationOptions,
): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  return requireString(
    value,

    field,

    options,
  );
}
