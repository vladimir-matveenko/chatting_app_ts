import { Router } from "express";

import { asyncHandler } from "../../../core/middleware/async-handler.js";

import type { HealthController } from "../controllers/health.controller.js";

export function createHealthRouter(controller: HealthController): Router {
  const router = Router();

  router.get(
    "/health",

    asyncHandler(controller.health.bind(controller)),
  );

  return router;
}
