import { ValidationError } from "../../errors/index.js";

import { ValidationConstants }
    from "../../validation/index.js";

import { requireString }
    from "./string.validator.js";

export function requirePassword(
    value: unknown,
    field = "password",
): string {

    const password =
        requireString(
            value,
            field,
        );

    if (
        password.length <
        ValidationConstants.User.Password.MinLength
    ) {

        throw new ValidationError(
            `${field} must contain at least ${ValidationConstants.User.Password.MinLength} characters.`,
        );

    }

    if (
        password.length >
        ValidationConstants.User.Password.MaxLength
    ) {

        throw new ValidationError(
            `${field} must not exceed ${ValidationConstants.User.Password.MaxLength} characters.`,
        );

    }

    return password;

}