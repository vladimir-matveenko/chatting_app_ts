import { ValidationError } from "../../errors/index.js";

import { ValidationConstants } from "../../validation/index.js";

import { requireString } from "./string.validator.js";

export function requireUserName(value: unknown, field = "userName"): string {
  const userName = requireString(value, field);

  if (userName.length < ValidationConstants.User.UserName.MinLength) {
    throw new ValidationError(
      `${field} must contain at least ${ValidationConstants.User.UserName.MinLength} characters.`,
    );
  }

  if (userName.length > ValidationConstants.User.UserName.MaxLength) {
    throw new ValidationError(
      `${field} must not exceed ${ValidationConstants.User.UserName.MaxLength} characters.`,
    );
  }

  if (!ValidationConstants.User.UserName.Regex.test(userName)) {
    throw new ValidationError(`${field} contains invalid characters.`);
  }

  return userName;
}
