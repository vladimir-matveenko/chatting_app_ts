import { Database }
    from "../database/database.js";

import {

    createUsersModule,

    type UsersFeature,

} from "../../features/users/index.js";

import {

    createAuthModule,

    type AuthModule,

} from "../../features/auth/index.js";
import { BcryptPasswordHasher } from "../security/password/index.js";
import { JwtServiceImpl } from "../security/jwt/index.js";
import { Sha256TokenHasher } from "../security/index.js";
import { JwtAuthMiddleware } from "../middleware/jwt-auth.middleware.js";

export class ApplicationContainer {

    readonly users: UsersFeature;

    readonly auth: AuthModule;

    constructor(
        database: Database,
    ) {

        const passwordHasher =
            new BcryptPasswordHasher();

        const jwtService =
            new JwtServiceImpl();

        const tokenHasher =
            new Sha256TokenHasher();

        const jwtAuthMiddleware =
            new JwtAuthMiddleware(
                jwtService,
            );

        this.users =
            createUsersModule(
                database,
                jwtService,
                jwtAuthMiddleware,
            );

        this.auth =
            createAuthModule(

                database,

                this.users,

                passwordHasher,

                tokenHasher,

                jwtService,

                jwtAuthMiddleware,

            );

    }

}