import type { Request } from "express";

import type { RequestValidator } from "../../../core/http/request-validator.js";

import {
  requireEmail,
  requirePassword,
  requireUserName,
} from "../../../core/http/validators/index.js";

import type { RegisterRequestDto } from "../dto/request/register.request.dto.js";

export class RegisterRequestValidator implements RequestValidator<RegisterRequestDto> {
  validate(request: Request): RegisterRequestDto {
    return {
      userName: requireUserName(request.body.userName),

      email: requireEmail(request.body.email, "email"),

      password: requirePassword(request.body.password),
    };
  }
}
