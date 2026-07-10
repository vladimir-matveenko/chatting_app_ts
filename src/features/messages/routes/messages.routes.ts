import { Router } from "express";

import { asyncHandler } from "../../../core/middleware/async-handler.js";

import type { JwtAuthMiddleware } from "../../../core/middleware/jwt-auth.middleware.js";

import type { MessagesController } from "../controllers/messages.controller.js";
import { MessageReactionsController } from "../controllers/message-reactions.controller.js";

export function createMessagesRouter(
  controller: MessagesController,

  reactionsController: MessageReactionsController,

  jwtAuthMiddleware: JwtAuthMiddleware,
): Router {
  const router = Router();

  router.post(
    "/chat/:id",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.create.bind(controller)),
  );

  router.get(
    "/chat/:id",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.findByChat.bind(controller)),
  );

  router.get(
    "/:id",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.findById.bind(controller)),
  );

  router.patch(
    "/:id",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.update.bind(controller)),
  );

  router.delete(
    "/:id",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.delete.bind(controller)),
  );

  router.post(
    "/:id/reactions",

    jwtAuthMiddleware.handler,

    asyncHandler(reactionsController.add.bind(reactionsController)),
  );

  router.delete(
    "/:id/reactions",

    jwtAuthMiddleware.handler,

    asyncHandler(reactionsController.remove.bind(reactionsController)),
  );

  return router;
}
