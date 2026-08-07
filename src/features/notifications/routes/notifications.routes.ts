import { Router } from "express";

import { asyncHandler } from "../../../core/middleware/async-handler.js";

import type { JwtAuthMiddleware } from "../../../core/middleware/jwt-auth.middleware.js";

import type { NotificationsController } from "../controllers/notifications.controller.js";

export function createNotificationsRouter(
  controller: NotificationsController,

  jwtAuthMiddleware: JwtAuthMiddleware,
): Router {
  const router = Router();

  // get notifications
  router.get(
    "/",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.findAll.bind(controller)),
  );

  // unread notifications count
  router.get(
    "/unread-count",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.countUnread.bind(controller)),
  );

  // mark notification as read
  router.post(
    "/:id/read",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.markRead.bind(controller)),
  );

  // mark all notifications as read
  router.post(
    "/read-all",

    jwtAuthMiddleware.handler,

    asyncHandler(controller.markAllRead.bind(controller)),
  );

  return router;
}
