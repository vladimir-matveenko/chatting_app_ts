import type { Request, Response } from "express";

import { BaseController } from "../../../core/http/base.controller.js";

import { env } from "../../../core/config/env.js";

import type { HealthResponseDto } from "../dto/response/health-response.dto.js";

export class HealthController extends BaseController {
  async health(_req: Request, res: Response<HealthResponseDto>): Promise<void> {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    this.ok(res, {
      status: "ok",
      version: env.appVersion,
    });
  }
}
