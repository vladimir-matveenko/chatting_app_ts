import { ValidationError } from "../../errors/index.js";

import { ValidationConstants }
    from "../../validation/index.js";

import { requireString }
    from "./string.validator.js";

export function requireUsername(
    value: unknown,
    field = "username",
): string {

    const username =
        requireString(
            value,
            field,
        );

    if (
        username.length <
        ValidationConstants.User.Username.MinLength
    ) {

        throw new ValidationError(
            `${field} must contain at least ${ValidationConstants.User.Username.MinLength} characters.`,
        );

    }

    if (
        username.length >
        ValidationConstants.User.Username.MaxLength
    ) {

        throw new ValidationError(
            `${field} must not exceed ${ValidationConstants.User.Username.MaxLength} characters.`,
        );

    }

    if (
        !ValidationConstants.User.Username.Regex.test(
            username,
        )
    ) {

        throw new ValidationError(
            `${field} contains invalid characters.`,
        );

    }

    return username;

}