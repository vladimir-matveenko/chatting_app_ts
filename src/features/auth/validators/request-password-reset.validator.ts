import type { Request } from "express";
import type { RequestValidator } from "../../../core/http/request-validator.js";
import { requireEmail } from "../../../core/http/validators/index.js";
import { RequestPasswordResetRequestDto } from "../dto/request/request-password-reset.request.dto.js";

export class RequestPasswordResetRequestValidator implements RequestValidator<RequestPasswordResetRequestDto> {
  validate(request: Request): RequestPasswordResetRequestDto {
    return {
      email: requireEmail(request.body.email, "email"),
    };
  }
}
