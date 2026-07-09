import type { Request } from "express";

import type { RequestValidator } from "../../../core/http/request-validator.js";

import { requirePassword } from "../../../core/http/validators/index.js";

import type { UpdatePasswordRequestDto } from "../dto/request/update-password.request.dto.js";

export class UpdatePasswordRequestValidator implements RequestValidator<UpdatePasswordRequestDto> {
  validate(request: Request): UpdatePasswordRequestDto {
    return {
      currentPassword: requirePassword(request.body.currentPassword),

      newPassword: requirePassword(request.body.newPassword),
    };
  }
}
