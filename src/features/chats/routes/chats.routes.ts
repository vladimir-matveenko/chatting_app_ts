import { Router } from "express";

import { asyncHandler } from "../../../core/middleware/async-handler.js";

import type { JwtAuthMiddleware } from "../../../core/middleware/jwt-auth.middleware.js";

import type { ChatsController } from "../controllers/chats.controller.js";

export function createChatsRouter(
  controller: ChatsController,

  jwtAuthMiddleware: JwtAuthMiddleware,
): Router {
  const router = Router();

  // get chats list
  router.get(
    "/",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.list.bind(controller)),
  );

  // create chat
  router.post(
    "/",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.create.bind(controller)),
  );

  // get chat by id
  router.get(
    "/:id",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.findById.bind(controller)),
  );

  // get chat members
  router.get(
    "/:id/members",

    jwtAuthMiddleware.handler,

    controller.findMembers.bind(controller),
  );

  // mark message as read
  router.post(
    "/:id/read",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.markRead.bind(controller)),
  );

  // archive chat
  router.patch(
    "/:id/archive",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.archive.bind(controller)),
  );

  // mute chat member
  router.patch(
    "/:id/mute",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.mute.bind(controller)),
  );

  return router;
}
