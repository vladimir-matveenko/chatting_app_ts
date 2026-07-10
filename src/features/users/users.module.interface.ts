import type { Router } from "express";

import type { UsersController } from "./controllers/users.controller.js";

import type { UsersRepository } from "./repositories/users.repository.js";

import type { UsersService } from "./services/users.service.js";
import { UsersMappers } from "./mappers/users.mappers.js";

export interface UsersFeature {
  router: Router;

  controller: UsersController;

  service: UsersService;

  repository: UsersRepository;

  mappers: UsersMappers;
}
