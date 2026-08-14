import express from "express";
import cors from "cors";

import { ApplicationContainer } from "./core/container/application-container.js";

import { errorHandler } from "./core/errors/error-handler.middleware.js";

import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "./swagger/swagger.js";

export function createApp(container: ApplicationContainer) {
  const app = express();

  app.use(cors());

  app.use(express.json());

  app.use("/auth", container.auth.router);

  app.use("/users", container.users.router);

  app.use(
    "/chats",

    container.chats.router,
  );

  app.use("/messages", container.messages.router);

  app.use("/notifications", container.notifications.router);

  app.get("/docs.json", (_req, res) => {
    res.json(swaggerSpec);
  });

  app.use(
    "/docs",

    swaggerUi.serve,

    swaggerUi.setup(swaggerSpec),
  );

  app.use(container.health.router);

  app.use(errorHandler);

  return app;
}
