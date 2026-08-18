import type { Request, Response } from "express";

import { BaseController } from "../../../core/http/base.controller.js";

import type { ResetPasswordService } from "../services/reset-password.service.js";

import { ResetPasswordRequestValidators } from "../validators/reset-password-request.validators.js";

export class ResetPasswordController extends BaseController {
  constructor(
    private readonly resetPasswordService: ResetPasswordService,

    private readonly validators: ResetPasswordRequestValidators,
  ) {
    super();
  }

  async requestCode(
    req: Request,

    res: Response,
  ): Promise<void> {
    const dto = this.validators.request.validate(req);

    await this.resetPasswordService.requestCode(dto);

    res.json({
      message: "If the email exists, a reset code has been sent.",
    });
  }

  async verifyCode(
    req: Request,

    res: Response,
  ): Promise<void> {
    const dto = this.validators.verify.validate(req);

    const resetToken = await this.resetPasswordService.verifyCode(dto.email, dto.code);

    res.json({
      resetToken,
    });
  }

  async resetPassword(
    req: Request,

    res: Response,
  ): Promise<void> {
    const dto = this.validators.reset.validate(req);

    await this.resetPasswordService.resetPassword(
      dto.resetToken,

      dto.password,
    );

    this.noContent(res);
  }
}
