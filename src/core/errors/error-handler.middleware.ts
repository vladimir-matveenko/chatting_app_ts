import type {
    ErrorRequestHandler,
    Request,
    Response,
    NextFunction,
} from "express";

import { AppError } from "./app.error.js";
import { logger } from "../logger/logger.js";

export const errorHandler: ErrorRequestHandler = (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void => {

    if (error instanceof AppError) {

        logger.warn(
            `${error.statusCode} ${error.code}: ${error.message}`,
        );

        res.status(error.statusCode).json({
            success: false,
            error: {
                code: error.code,
                message: error.message,
            },
        });

        return;
    }

    logger.error("Unhandled error", error);

    res.status(500).json({
        success: false,
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Internal server error.",
        },
    });

};