import { HealthController } from "./controllers/health.controller.js";

import { createHealthRouter } from "./routes/health.routes.js";

import type { HealthFeature } from "./health.module.interface.js";

export function createHealthModule(): HealthFeature {
  const controller = new HealthController();

  const router = createHealthRouter(controller);

  return {
    router,

    controller,
  };
}
