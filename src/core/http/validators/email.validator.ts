import { ValidationError } from "../../errors/index.js";

import { requireString } from "./string.validator.js";

const EMAIL_REGEX =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function requireEmail(
    value: unknown,
    field: string,
): string {

    const email =
        requireString(value, field);

    if (!EMAIL_REGEX.test(email)) {
        throw new ValidationError(
            `${field} is invalid.`,
        );
    }

    return email;

}