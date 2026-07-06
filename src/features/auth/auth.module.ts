import { Database }
    from "../../core/database/database.js";

import type {
    JwtService,
} from "../../core/security/jwt/index.js";

import type {
    UsersFeature,
} from "../users/index.js";

import type {
    AuthModule,
} from "./auth.module.interface.js";

import { AuthController }
    from "./controllers/auth.controller.js";

import { AuthMappers }
    from "./mappers/auth.mappers.js";

import { RefreshTokenMapper }
    from "./mappers/refresh-token.mapper.js";

import { RefreshTokensRepository }
    from "./repositories/refresh-tokens.repository.js";

import { AuthService }
    from "./services/auth.service.js";

import { createAuthRouter }
    from "./routes/auth.routes.js";

import { AuthRequestValidators }
    from "./validators/auth-request.validators.js";

import { LoginRequestValidator }
    from "./validators/login-request.validator.js";

import { RegisterRequestValidator }
    from "./validators/register-request.validator.js";

import { RefreshTokenRequestValidator }
    from "./validators/refresh-token-request.validator.js";
import { PasswordHasher } from "../../core/security/password/index.js";
import { TokenHasher } from "../../core/security/index.js";
import { JwtAuthMiddleware } from "../../core/middleware/jwt-auth.middleware.js";

export function createAuthModule(

    database: Database,

    users: UsersFeature,

    passwordHasher: PasswordHasher,

    tokenHasher: TokenHasher,

    jwtService: JwtService,

    jwtAuthMiddleware: JwtAuthMiddleware,

): AuthModule {

    const mappers =
        new AuthMappers(
            users.mappers.response,
        );

    const refreshTokensRepository =
        new RefreshTokensRepository(

            database,

            new RefreshTokenMapper(),

        );

    const service =
        new AuthService(

            users.repository,

            refreshTokensRepository,

            users.service,

            passwordHasher,

            tokenHasher,

            jwtService,

        );

    const validators =
        new AuthRequestValidators(

            new LoginRequestValidator(),

            new RegisterRequestValidator(),

            new RefreshTokenRequestValidator(),

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
                jwtAuthMiddleware,
            ),

        service,

        repository:
            refreshTokensRepository,

        mappers,

    };

}