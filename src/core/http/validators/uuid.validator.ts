import { BadRequestError } from "../../errors/index.js";

import { requireString } from "./string.validator.js";

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function requireUuid(
    value: unknown,
    field: string,
): string {

    const uuid = requireString(value, field);

    if (!UUID_REGEX.test(uuid)) {
        throw new BadRequestError(
            `${field} must be a valid UUID.`,
            "INVALID_UUID",
        );
    }

    return uuid;
}