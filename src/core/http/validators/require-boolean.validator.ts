import { BadRequestError } from "../../errors/index.js";

export function requireBoolean(
  value: unknown,

  field: string,
): boolean {
  if (typeof value !== "boolean") {
    throw new BadRequestError(
      `${field} must be a boolean.`,

      "INVALID_BOOLEAN",
    );
  }

  return value;
}
