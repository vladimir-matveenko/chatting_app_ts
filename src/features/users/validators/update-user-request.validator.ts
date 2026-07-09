import type { Request } from "express";

import type { RequestValidator } from "../../../core/http/request-validator.js";

import type { UpdateUserRequestDto } from "../dto/request/update-user.request.dto.js";
import {
  requireEmail,
  requireString,
  requireUsername,
} from "../../../core/http/validators/index.js";
import { ValidationError } from "../../../core/errors/index.js";

export class UpdateUserRequestValidator implements RequestValidator<UpdateUserRequestDto> {
  validate(request: Request): UpdateUserRequestDto {
    const dto: UpdateUserRequestDto = {};

    if (request.body.email !== undefined) {
      dto.email = requireEmail(request.body.email, "email");
    }

    if (request.body.username !== undefined) {
      dto.username = requireUsername(request.body.username);
    }

    if (request.body.displayName !== undefined) {
      dto.displayName = requireString(request.body.displayName, "displayName");
    }

    if (request.body.avatarUrl !== undefined) {
      dto.avatarUrl = requireString(request.body.avatarUrl, "avatarUrl");
    }

    if (
      dto.email === undefined &&
      dto.username === undefined &&
      dto.avatarUrl === undefined &&
      dto.displayName === undefined
    ) {
      throw new ValidationError("At least one field must be provided.");
    }

    return dto;
  }
}
