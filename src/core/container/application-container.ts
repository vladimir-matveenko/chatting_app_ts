import { createUsersModule } from "../../features/users/index.js";

import { Database } from "../database/database.js";

import type { FeatureModule } from "../modules/index.js";

export class ApplicationContainer {

    readonly users: FeatureModule;

    constructor(
        database: Database,
    ) {

        this.users =
            createUsersModule(
                database,
            );

    }
}