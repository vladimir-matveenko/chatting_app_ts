import type {
    Router,
} from "express";

import type {
    HealthController,
} from "./controllers/health.controller.js";

export interface HealthFeature {

    router: Router;

    controller: HealthController;

}