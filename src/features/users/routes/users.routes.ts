import { Router } from "express";

import { asyncHandler } from "../../../core/middleware/async-handler.js";

import { UsersController } from "../controllers/users.controller.js";
import { JwtAuthMiddleware } from "../../../core/middleware/jwt-auth.middleware.js";

export function createUsersRouter(
  controller: UsersController,
  jwtAuthMiddleware: JwtAuthMiddleware,
): Router {
  const router = Router();

  router.post("/", asyncHandler(controller.create.bind(controller)));

  router.get(
    "/me",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.me.bind(controller)),
  );

  router.get(
    "/:id",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.getById.bind(controller)),
  );

  router.get(
    "/email/:email",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.getByEmail.bind(controller)),
  );

  router.get(
    "/username/:username",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.getByUsername.bind(controller)),
  );

  router.patch(
    "/me",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.updateMe.bind(controller)),
  );

  router.patch(
    "/me/password",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.updatePassword.bind(controller)),
  );

  return router;
}
