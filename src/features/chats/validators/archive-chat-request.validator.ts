import type { Request } from "express";

import type { RequestValidator } from "../../../core/http/request-validator.js";

import type { ArchiveChatRequestDto } from "../dto/request/archive-chat.request.dto.js";

import { ValidationError } from "../../../core/errors/index.js";

export class ArchiveChatRequestValidator implements RequestValidator<ArchiveChatRequestDto> {
  validate(request: Request): ArchiveChatRequestDto {
    if (typeof request.body.isArchived !== "boolean") {
      throw new ValidationError("isArchived must be boolean.");
    }

    return {
      isArchived: request.body.isArchived,
    };
  }
}
