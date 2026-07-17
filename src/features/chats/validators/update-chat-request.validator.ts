import type { Request } from "express";

import { ValidationError } from "../../../core/errors/index.js";
import type { RequestValidator } from "../../../core/http/request-validator.js";

import type { UpdateChatRequestDto } from "../dto/request/update-chat-request.dto.js";

export class UpdateChatRequestValidator implements RequestValidator<UpdateChatRequestDto> {
  validate(request: Request): UpdateChatRequestDto {
    const dto: UpdateChatRequestDto = {};

    if (request.body.title !== undefined) {
      if (typeof request.body.title !== "string") {
        throw new ValidationError("Title must be a string.");
      }

      const title = request.body.title.trim();

      if (title.length === 0) {
        throw new ValidationError("Title must not be empty.");
      }

      if (title.length > 100) {
        throw new ValidationError("Title must not exceed 100 characters.");
      }

      dto.title = title;
    }

    if (request.body.avatarUrl !== undefined) {
      if (request.body.avatarUrl !== null && typeof request.body.avatarUrl !== "string") {
        throw new ValidationError("Avatar url must be a string.");
      }

      dto.avatarUrl = request.body.avatarUrl;
    }

    if (dto.title === undefined && dto.avatarUrl === undefined) {
      throw new ValidationError("Nothing to update.");
    }

    return dto;
  }
}
