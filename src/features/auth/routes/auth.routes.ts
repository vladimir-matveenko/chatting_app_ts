import { Router } from "express";

import { asyncHandler }
    from "../../../core/middleware/async-handler.js";

import type { AuthController }
    from "../controllers/auth.controller.js";

export function createAuthRouter(
    controller: AuthController,
): Router {

    const router =
        Router();

    router.post(

        "/register",

        asyncHandler(
            controller.register.bind(
                controller,
            ),
        ),

    );

    router.post(

        "/login",

        asyncHandler(
            controller.login.bind(
                controller,
            ),
        ),

    );

    return router;

}