import { ValidationConstants } from "../../validation/index.js";

import { requireString } from "./string.validator.js";

export function requirePassword(value: unknown, field = "password"): string {
  const password = requireString(value, field, {
    minLength: ValidationConstants.User.Password.MinLength,
    maxLength: ValidationConstants.User.Password.MaxLength,
  });

  return password;
}
