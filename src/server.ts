import { createApp } from "./app.js";

import { Database } from "./core/database/database.js";
import { env } from "./core/config/env.js";
import { db } from "./core/config/database.js";

const database =
    new Database(db);

const app =
    createApp(database);

app.listen(
    env.port,
    () => {

        console.log(
            `Server started on port ${env.port}`,
        );

    },
);