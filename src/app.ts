import express from "express";

import { errorHandler } from "./core/errors/error-handler.middleware.js";

const app = express();

app.use(express.json());

// routes

app.use(errorHandler);

export default app;