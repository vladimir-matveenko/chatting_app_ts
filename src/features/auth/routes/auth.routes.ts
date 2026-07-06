import { Router } from "express";

import { asyncHandler }
    from "../../../core/middleware/async-handler.js";

import type { AuthController }
    from "../controllers/auth.controller.js";
import { JwtAuthMiddleware } from "../../../core/middleware/jwt-auth.middleware.js";


export function createAuthRouter(
    controller: AuthController,
    jwtAuthMiddleware: JwtAuthMiddleware,
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

    router.post(

        "/refresh",

        asyncHandler(

            controller.refresh.bind(
                controller,
            ),

        ),

    );

    router.post(

        "/logout",

        jwtAuthMiddleware.handler,

        asyncHandler(

            controller.logout.bind(
                controller,
            ),

        ),

    );

    return router;

}