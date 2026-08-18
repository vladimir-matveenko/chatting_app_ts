import type { Request } from "express";
import type { RequestValidator } from "../../../core/http/request-validator.js";
import { requireEmail } from "../../../core/http/validators/index.js";
import { VerifyPasswordResetRequestDto } from "../dto/request/verify-password-reset.request.dto.js";
import { requireVerificationCode } from "../../../core/http/validators/require-verification-code.js";

export class VerifyPasswordResetRequestValidator implements RequestValidator<VerifyPasswordResetRequestDto> {
  validate(request: Request): VerifyPasswordResetRequestDto {
    return {
      email: requireEmail(request.body.email, "email"),

      code: requireVerificationCode(request.body.code, "code"),
    };
  }
}
