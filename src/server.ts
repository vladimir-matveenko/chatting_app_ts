import { createApp } from "./app.js";

import { Database } from "./core/database/database.js";
import { env } from "./core/config/env.js";
import { db } from "./core/config/database.js";
import { ApplicationContainer } from "./core/container/application-container.js";

const database =
    new Database(db);

const container =
    new ApplicationContainer(
        database,
    );

const app =
    createApp(
        container,
    );
app.listen(
    env.port,
    () => {

        console.log(
            'Server started on port ${env.port}',
        );

    },
);