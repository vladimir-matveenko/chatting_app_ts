import { Router } from "express";

import { asyncHandler } from "../../../core/middleware/async-handler.js";

import { UsersController } from "../controllers/users.controller.js";

export function createUsersRouter(
    controller: UsersController,
): Router {

    const router = Router();

    router.post(
        "/",
        asyncHandler(
            controller.create.bind(controller),
        ),
    );

    router.get(
        "/:id",
        asyncHandler(
            controller.getById.bind(controller),
        ),
    );

    router.get(
        "/email/:email",
        asyncHandler(
            controller.getByEmail.bind(controller),
        ),
    );

    router.get(
        "/username/:username",
        asyncHandler(
            controller.getByUsername.bind(controller),
        ),
    );

    return router;

}