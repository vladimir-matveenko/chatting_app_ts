import { ValidationError } from "../../errors/index.js";

import { ValidationConstants } from "../../validation/index.js";

import { requireString } from "./string.validator.js";

export function requireUserName(value: unknown, field = "userName"): string {
  const userName = requireString(value, field, {
    minLength: ValidationConstants.User.UserName.MinLength,
    maxLength: ValidationConstants.User.UserName.MaxLength,
  });

  if (!ValidationConstants.User.UserName.Regex.test(userName)) {
    throw new ValidationError(`${field} contains invalid characters.`);
  }

  return userName;
}
