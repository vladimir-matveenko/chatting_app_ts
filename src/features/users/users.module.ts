import { Database } from "../../core/database/database.js";

import { UsersController } from "./controllers/users.controller.js";
import { UsersMappers } from "./mappers/users.mappers.js";
import { UsersRepository } from "./repositories/users.repository.js";
import { createUsersRouter } from "./routes/users.routes.js";
import { UsersService } from "./services/users.service.js";

import { CreateUserRequestValidator } from "./validators/create-user-request.validator.js";
import { GetUserByEmailRequestValidator } from "./validators/get-user-by-email-request.validator.js";
import { GetUserByIdRequestValidator } from "./validators/get-user-by-id-request.validator.js";
import { GetUserByUsernameRequestValidator } from "./validators/get-user-by-username-request.validator.js";
import { UsersRequestValidators } from "./validators/users-request.validators.js";

import type { UsersFeature } from "./users.module.interface.js";
import { JwtAuthMiddleware } from "../../core/middleware/jwt-auth.middleware.js";
import { PasswordHasher } from "../../core/security/password/index.js";
import { UpdateUserRequestValidator } from "./validators/update-user-request.validator.js";
import { UpdatePasswordRequestValidator } from "./validators/update-password-request.validator.js";
import { RefreshTokensRepository } from "../auth/repositories/refresh-tokens.repository.js";
import { FindUsersRequestValidator } from "./validators/find-users.request.validator.js";
import { UserListRepository } from "./repositories/user-list.repository.js";

export function createUsersModule(
  database: Database,
  jwtAuthMiddleware: JwtAuthMiddleware,
  passwordHasher: PasswordHasher,
  refreshTokensRepository: RefreshTokensRepository,
): UsersFeature {
  const mappers = new UsersMappers();

  const repository = new UsersRepository(database, mappers);

  const userListRepository = new UserListRepository(database, mappers);

  const service = new UsersService(
    repository,
    userListRepository,
    refreshTokensRepository,
    passwordHasher,
  );

  const validators = new UsersRequestValidators(
    new CreateUserRequestValidator(),
    new GetUserByIdRequestValidator(),
    new GetUserByEmailRequestValidator(),
    new GetUserByUsernameRequestValidator(),
    new UpdateUserRequestValidator(),
    new UpdatePasswordRequestValidator(),
    new FindUsersRequestValidator(),
  );

  const controller = new UsersController(service, validators, mappers);

  const router = createUsersRouter(controller, jwtAuthMiddleware);

  return {
    router,

    controller,

    service,

    repository,

    mappers,
  };
}
