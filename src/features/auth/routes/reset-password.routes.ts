import { Router } from "express";

import { asyncHandler } from "../../../core/middleware/async-handler.js";

import type { ResetPasswordController } from "../controllers/reset-password.controller.js";

export function createResetPasswordRouter(controller: ResetPasswordController): Router {
  const router = Router();

  router.post("/request", asyncHandler(controller.requestCode.bind(controller)));

  router.post("/verify", asyncHandler(controller.verifyCode.bind(controller)));

  router.patch("/", asyncHandler(controller.resetPassword.bind(controller)));

  return router;
}
