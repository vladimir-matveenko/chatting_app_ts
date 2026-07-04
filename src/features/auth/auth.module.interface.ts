import type { Router } from "express";

import type { AuthController }
    from "./controllers/auth.controller.js";

import type { AuthService }
    from "./services/auth.service.js";

export interface AuthModule {

    router: Router;

    controller: AuthController;

    service: AuthService;

}