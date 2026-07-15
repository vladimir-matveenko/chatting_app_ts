import { BadRequestError } from "../../errors/index.js";

export function requirePathId(
  value: unknown,

  field = "id",
): string {
  if (typeof value !== "string") {
    throw new BadRequestError(`${field} is required.`);
  }

  const result = value.trim();

  if (!result) {
    throw new BadRequestError(`${field} is required.`);
  }

  return result;
}
