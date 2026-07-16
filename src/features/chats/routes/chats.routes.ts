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

  // remove current user from chat
  router.delete(
    "/:id/members/me",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.leave.bind(controller)),
  );

  // add members to chat
  router.post(
    "/:id/members",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.addMembers.bind(controller)),
  );

  // remove member from chat
  router.delete(
    "/:id/members/:userId",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.removeMember.bind(controller)),
  );

  // change member role
  router.patch(
    "/:id/members/:userId/role",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.changeMemberRole.bind(controller)),
  );

  // change owner of the chat
  router.patch(
    "/:id/owner",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.transferOwnership.bind(controller)),
  );

  return router;
}
