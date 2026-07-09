import { requireString } from "./string.validator.js";

export function requireNullableString(
  value: unknown,

  field: string,
): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  return requireString(
    value,

    field,
  );
}
