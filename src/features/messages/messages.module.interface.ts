import type { Router } from "express";

import type { MessagesController } from "./controllers/messages.controller.js";

import type { MessagesMapper } from "./mappers/messages.mapper.js";

import type { MessagesRepository } from "./repositories/messages.repository.js";

import type { MessagesService } from "./services/messages.service.js";

export interface MessagesFeature {
  router: Router;

  controller: MessagesController;

  service: MessagesService;

  repository: MessagesRepository;

  mapper: MessagesMapper;
}
