import { Database } from "../../core/database/database.js";
import { JwtService } from "../../core/security/jwt/index.js";

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
import { BcryptPasswordHasher } from "../../core/security/password/index.js";

export function createUsersModule(
    database: Database,
    jwtService: JwtService,
): UsersFeature {

    const mappers =
        new UsersMappers();

    const repository =
        new UsersRepository(
            database,
            mappers,
        );

    const passwordHasher =
        new BcryptPasswordHasher();

    const service =
        new UsersService(
            repository,
            passwordHasher,
        );

    const validators =
        new UsersRequestValidators(
            new CreateUserRequestValidator(),
            new GetUserByIdRequestValidator(),
            new GetUserByEmailRequestValidator(),
            new GetUserByUsernameRequestValidator(),
        );

    const controller =
        new UsersController(
            service,
            validators,
            mappers,
        );

    const jwtAuth =
        new JwtAuthMiddleware(
            jwtService,
        );

    const router =
        createUsersRouter(
            controller, jwtAuth,
        );

    return {

        router,

        controller,

        service,

        repository,

        mappers,

    };

}