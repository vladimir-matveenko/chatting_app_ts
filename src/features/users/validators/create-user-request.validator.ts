import type { Request } from "express";

import type { RequestValidator } from "../../../core/http/request-validator.js";

import {
  requireEmail,
  requirePassword,
  requireUsername,
} from "../../../core/http/validators/index.js";

import type { CreateUserRequestDto } from "../dto/request/create-user.request.dto.js";

export class CreateUserRequestValidator implements RequestValidator<CreateUserRequestDto> {
  validate(request: Request): CreateUserRequestDto {
    return {
      username: requireUsername(request.body.username),

      email: requireEmail(request.body.email, "email"),

      password: requirePassword(request.body.password),
    };
  }
}
