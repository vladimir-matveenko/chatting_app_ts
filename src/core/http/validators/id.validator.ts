import { BadRequestError } from "../../errors/index.js";

import { requireString } from "./string.validator.js";

export function requireId(
    value: unknown,
    field: string,
): string {

    const id = requireString(value, field);

    const number = Number(id);

    if (!Number.isInteger(number) || number <= 0) {
        throw new BadRequestError(
            `${field} must be a valid id.`,
            "INVALID_ID",
        );
    }

    return id;
}