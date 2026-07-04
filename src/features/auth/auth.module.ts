import type { PasswordHasher }
    from "../../core/security/password-hasher.js";

import type { JwtService }
    from "../../core/security/jwt-service.js";

import type { UsersFeature }
    from "../users/users.module.interface.js";

import type { AuthModule }
    from "./auth.module.interface.js";

import { AuthController }
    from "./controllers/auth.controller.js";

import { AuthMappers }
    from "./mappers/auth.mappers.js";

import { createAuthRouter }
    from "./routes/auth.routes.js";

import { AuthService }
    from "./services/auth.service.js";

import { AuthRequestValidators }
    from "./validators/auth-request.validators.js";

import { LoginRequestValidator }
    from "./validators/login-request.validator.js";

import { RegisterRequestValidator }
    from "./validators/register-request.validator.js";

export function createAuthModule(
    users: UsersFeature,
    passwordHasher: PasswordHasher,
    jwtService: JwtService,
): AuthModule {

    const mappers =
        new AuthMappers(
            users.mappers.response,
        );

    const validators =
        new AuthRequestValidators(
            new RegisterRequestValidator(),
            new LoginRequestValidator(),
        );

    const service =
        new AuthService(
            users.repository,
            users.service,
            passwordHasher,
            jwtService,
        );

    const controller =
        new AuthController(
            service,
            validators,
            mappers,
        );

    return {

        router:
            createAuthRouter(
                controller,
            ),

        controller,

        service,

    };

}