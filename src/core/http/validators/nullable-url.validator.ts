import { requireUrl } from "./url.validator.js";

export function requireNullableUrl(
  value: unknown,

  field: string,
): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  return requireUrl(
    value,

    field,
  );
}
