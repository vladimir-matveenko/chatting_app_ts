import { Database } from "../database/database.js";

import {
    createUsersModule,
} from "../../features/users/users.module.js";

export class ApplicationContainer {

    readonly users;

    constructor(
        database: Database,
    ) {

        this.users =
            createUsersModule(
                database,
            );

    }

}