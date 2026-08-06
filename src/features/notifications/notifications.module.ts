import type { Database } from "../../core/database/database.js";
import { JwtAuthMiddleware } from "../../core/middleware/jwt-auth.middleware.js";
import { SocketEventPublisher } from "../../core/websocket/publishers/socket-event.publisher.js";

import type { NotificationsFeature } from "./notifications.module.interface.js";

import { NotificationsRepository } from "./repositories/notifications.repository.js";

import { NotificationsService } from "./services/notifications.service.js";

import { NotificationsController } from "./controllers/notifications.controller.js";
import { createNotificationsRouter } from "./routes/notifications.routes.js";

export function createNotificationsModule(
  database: Database,

  jwtAuthMiddleware: JwtAuthMiddleware,

  socketPublisher: SocketEventPublisher,
): NotificationsFeature {
  const notificationsRepository = new NotificationsRepository(database);

  const notificationsService = new NotificationsService(notificationsRepository, socketPublisher);

  const notificationsController = new NotificationsController(notificationsService);

  const router = createNotificationsRouter(notificationsController, jwtAuthMiddleware);

  return {
    router,

    controller: notificationsController,

    service: notificationsService,

    repository: notificationsRepository,
  };
}
