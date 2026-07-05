import { Database }
    from "../database/database.js";

import {

    BcryptPasswordHasher,

    JwtServiceImpl,

} from "../security/index.js";

import {

    createUsersModule,

    type UsersFeature,

} from "../../features/users/index.js";

import {

    createAuthModule,

    type AuthModule,

} from "../../features/auth/index.js";

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

                jwtService,

            );

    }

}