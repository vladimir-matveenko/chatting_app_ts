import { Router } from "express";

import { asyncHandler } from "../../../core/middleware/async-handler.js";

import type { JwtAuthMiddleware } from "../../../core/middleware/jwt-auth.middleware.js";

import type { MessagesController } from "../controllers/messages.controller.js";

export function createMessagesRouter(
  controller: MessagesController,

  jwtAuthMiddleware: JwtAuthMiddleware,
): Router {
  const router = Router();

  router.post(
    "/chat/:id",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.create.bind(controller)),
  );

  return router;
}
