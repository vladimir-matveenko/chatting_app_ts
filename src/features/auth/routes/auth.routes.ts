import { Router } from "express";

import { asyncHandler } from "../../../core/middleware/async-handler.js";
import { JwtAuthMiddleware } from "../../../core/middleware/jwt-auth.middleware.js";

import { AuthController } from "../controllers/auth.controller.js";
import { ResetPasswordController } from "../controllers/reset-password.controller.js";
import { createResetPasswordRouter } from "./reset-password.routes.js";

export function createAuthRouter(
  controller: AuthController,
  resetPasswordController: ResetPasswordController,
  jwtAuthMiddleware: JwtAuthMiddleware,
): Router {
  const router = Router();

  router.use("/password-reset", createResetPasswordRouter(resetPasswordController));

  router.post("/register", asyncHandler(controller.register.bind(controller)));

  router.post("/login", asyncHandler(controller.login.bind(controller)));

  router.post("/refresh", asyncHandler(controller.refresh.bind(controller)));

  router.post(
    "/logout",
    jwtAuthMiddleware.handler,
    asyncHandler(controller.logout.bind(controller)),
  );

  return router;
}
