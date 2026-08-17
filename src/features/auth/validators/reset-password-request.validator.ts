import type { Request } from "express";
import type { RequestValidator } from "../../../core/http/request-validator.js";
import { ResetPasswordRequestDto } from "../dto/request/reset-password.request.dto.js";
import { requirePassword, requireString } from "../../../core/http/validators/index.js";

export class ResetPasswordRequestValidator implements RequestValidator<ResetPasswordRequestDto> {
  validate(request: Request): ResetPasswordRequestDto {
    return {
      resetToken: requireString(request.body.resetToken, "resetToken"),

      password: requirePassword(request.body.password),
    };
  }
}
