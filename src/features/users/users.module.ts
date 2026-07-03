import { UserMapper } from "./mappers/user.mapper.js";
import { UserResponseMapper } from "./mappers/user-response.mapper.js";
import { UsersResponseMappers } from "./mappers/users-response.mappers.js";

import { CreateUserRequestValidator } from "./validators/create-user-request.validator.js";
import { GetUserByEmailRequestValidator } from "./validators/get-user-by-email-request.validator.js";
import { GetUserByIdRequestValidator } from "./validators/get-user-by-id-request.validator.js";
import { GetUserByUsernameRequestValidator } from "./validators/get-user-by-username-request.validator.js";
import { UsersRequestValidators } from "./validators/users-request.validators.js";
import { createUsersRouter } from "./routes/users.routes.js";
import { Database } from "../../core/database/database.js";
import { UsersController } from "./controllers/users.controller.js";
import { UsersRepository } from "./repositories/users.repository.js";
import { UsersService } from "./services/users.service.js";
import {
    BcryptPasswordHasher,
} from "../../core/security/index.js";



export function createUsersModule(
    database: Database,
) {

    const userMapper =
        new UserMapper();

    const responseMapper =
        new UserResponseMapper();

    const responseMappers =
        new UsersResponseMappers(
            responseMapper,
        );

    const repository =
        new UsersRepository(
            database,
            userMapper,
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
            responseMappers,
        );

    const router =
        createUsersRouter(
            controller,
        );

    return {

        repository,

        service,

        controller,

        router,

    };

}