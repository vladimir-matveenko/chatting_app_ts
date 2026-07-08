import {
    Router,
} from "express";

import {
    asyncHandler,
} from "../../../core/middleware/async-handler.js";

import type {
    JwtAuthMiddleware,
} from "../../../core/middleware/jwt-auth.middleware.js";

import type {
    ChatsController,
} from "../controllers/chats.controller.js";

export function createChatsRouter(

    controller: ChatsController,

    jwtAuthMiddleware: JwtAuthMiddleware,

): Router {

    const router =
        Router();

    router.get(

        "/",

        jwtAuthMiddleware.handler,

        asyncHandler(

            controller.list.bind(

                controller,

            ),

        ),

    );

    router.post(

        "/",

        jwtAuthMiddleware.handler,

        asyncHandler(

            controller.create.bind(

                controller,

            ),

        ),

    );

    return router;

}