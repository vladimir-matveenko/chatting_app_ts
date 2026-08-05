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

  // create message in the chat
  router.post(
    "/chat/:id",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.create.bind(controller)),
  );

  // get messages from the chat
  router.get(
    "/chat/:id",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.getMessages.bind(controller)),
  );

  // search messages
  router.get("/chat/:id/search", jwtAuthMiddleware.handler, controller.search.bind(controller));

  // get message
  router.get(
    "/:id",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.findById.bind(controller)),
  );

  // update message
  router.patch(
    "/:id",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.update.bind(controller)),
  );

  // delete message
  router.delete(
    "/:id",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.delete.bind(controller)),
  );

  // add reaction
  router.post(
    "/:id/reactions",

    jwtAuthMiddleware.handler,

    asyncHandler(reactionsController.add.bind(reactionsController)),
  );

  // delete reaction
  router.delete(
    "/:id/reactions",

    jwtAuthMiddleware.handler,

    asyncHandler(reactionsController.remove.bind(reactionsController)),
  );

  // get pinned messages
  router.get(
    "/chat/:chatId/pinned",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.findPinnedMessages.bind(controller)),
  );

  // pin message
  router.put(
    "/:id/pin",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.pinMessage.bind(controller)),
  );

  // unpin message
  router.delete(
    "/:id/unpin",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.unpinMessage.bind(controller)),
  );

  // mark message as read
  router.post("/:id/read", jwtAuthMiddleware.handler, controller.markRead.bind(controller));

  return router;
}
