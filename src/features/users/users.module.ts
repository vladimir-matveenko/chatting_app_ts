import { Database } from "../../core/database/database.js";
import type { FeatureModule } from "../../core/modules/index.js";
import { BcryptPasswordHasher } from "../../core/security/index.js";

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

export function createUsersModule(
    database: Database,
): FeatureModule {

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

    return {
        router: createUsersRouter(controller),
    };

}