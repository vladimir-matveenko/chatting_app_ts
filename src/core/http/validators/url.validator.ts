import {
    ValidationError,
} from "../../errors/index.js";

export function requireUrl(

    value: unknown,

    field: string,

): string {

    if (

        typeof value !== "string"

    ) {

        throw new ValidationError(

            `${field} must be a string.`,

        );

    }

    try {

        new URL(value);

    } catch {

        throw new ValidationError(

            `${field} must be a valid URL.`,

        );

    }

    return value;

}