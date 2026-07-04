import express from "express";
import cors from "cors";

import { ApplicationContainer } from "./core/container/application-container.js";

import { errorHandler } from "./core/errors/error-handler.middleware.js";

export function createApp(
    container: ApplicationContainer,
) {
    const app =
        express();

    app.use(cors());

    app.use(express.json());

    app.use(
        "/users",
        container.users.router,
    );

    app.use(
        errorHandler,
    );

    return app;
}