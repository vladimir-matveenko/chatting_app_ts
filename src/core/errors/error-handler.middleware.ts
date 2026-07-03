import type {
    ErrorRequestHandler,
} from "express";

import { logger } from "../logger/logger.js";

import { AppError } from "./app.error.js";

export const errorHandler: ErrorRequestHandler = (
    error,
    _req,
    res,
    _next,
): void => {

    if (error instanceof AppError) {

        logger.warn(
            `${error.code}: ${error.message}`,
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

    logger.error(
        "Unhandled error",
        error,
    );

    res.status(500).json({

        success: false,

        error: {

            code: "INTERNAL_SERVER_ERROR",

            message: "Internal server error.",

        },

    });

};