import express from "express";
import cors from "cors";
import { Database } from "./core/database/database.js";
import { createUsersModule } from "./features/users/users.module.js";
import { errorHandler } from "./core/errors/error-handler.middleware.js";

export function createApp(
    database: Database,
) {
    const app = express();

    app.use(cors());
    app.use(express.json());

    const usersModule =
        createUsersModule(database);

    app.use(
        "/users",
        usersModule.router,
    );

    app.use(errorHandler);

    return app;
}