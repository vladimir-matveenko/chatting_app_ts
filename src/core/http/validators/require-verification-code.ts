import { BadRequestError } from "../../errors/index.js";

export function requireVerificationCode(value: unknown, fieldName = "code"): string {
  if (typeof value !== "string" || !/^\d{6}$/.test(value)) {
    throw new BadRequestError(`${fieldName} must be a 6-digit code.`, "INVALID_VERIFICATION_CODE");
  }

  return value;
}
