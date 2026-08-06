import { Router } from "express";
import { NotificationsController } from "./controllers/notifications.controller.js";
import { NotificationsService } from "./services/notifications.service.js";
import { NotificationsRepository } from "./repositories/notifications.repository.js";

export interface NotificationsFeature {
  router: Router;

  controller: NotificationsController;

  service: NotificationsService;

  repository: NotificationsRepository;
}
