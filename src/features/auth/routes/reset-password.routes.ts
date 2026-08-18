import { Router } from "express";

import { asyncHandler } from "../../../core/middleware/async-handler.js";

import type { ResetPasswordController } from "../controllers/reset-password.controller.js";
import { passwordResetRequestRateLimiter } from "../../../core/middleware/rate-limit.middleware.js";

export function createResetPasswordRouter(controller: ResetPasswordController): Router {
  const router = Router();

  router.post(
    "/request",
    passwordResetRequestRateLimiter,
    asyncHandler(controller.requestCode.bind(controller)),
  );

  router.post(
    "/verify",
    passwordResetRequestRateLimiter,
    asyncHandler(controller.verifyCode.bind(controller)),
  );

  router.patch("/", asyncHandler(controller.resetPassword.bind(controller)));

  return router;
}
