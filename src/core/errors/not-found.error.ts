import { AppError } from "./app.error.js";

export class NotFoundError extends AppError {
    constructor(
        message = "Not found.",
        code = "NOT_FOUND",
    ) {
        super(message, 404, code);
    }
}