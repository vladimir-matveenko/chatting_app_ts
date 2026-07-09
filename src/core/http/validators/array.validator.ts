import { ValidationError } from "../../errors/index.js";

export function requireArray<T>(
  value: unknown,

  field: string,

  validator?: (value: unknown, field: string) => T,
): T[] {
  if (!Array.isArray(value)) {
    throw new ValidationError(`${field} must be an array.`);
  }

  if (!validator) {
    return value as T[];
  }

  return value.map(
    (
      item,

      index,
    ) =>
      validator(
        item,

        `${field}[${index}]`,
      ),
  );
}
