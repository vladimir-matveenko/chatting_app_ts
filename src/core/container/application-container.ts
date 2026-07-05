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

        this.users =
            createUsersModule(

                database,

                jwtService,

            );

        this.auth =
            createAuthModule(

                database,

                this.users,

                passwordHasher,

                tokenHasher,

                jwtService,

            );

    }

}