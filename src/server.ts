import { createServer } from "node:http";

import { createApp } from "./app.js";

import { Database } from "./core/database/database.js";

import { env } from "./core/config/env.js";

import { db } from "./core/config/database.js";

import { ApplicationContainer } from "./core/container/application-container.js";

import { SocketServer } from "./core/websocket/index.js";

const database = new Database(db);

const container = new ApplicationContainer(database);

const app = createApp(container);

const server = createServer(app);

const socketServer = new SocketServer(server);

socketServer.register(container.socketAuthMiddleware, container.socketGateway);

server.listen(env.port, () => {
  console.log(`Server started on port ${env.port}`);
});
