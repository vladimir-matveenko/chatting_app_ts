import type { Request } from "express";

import type { RequestValidator } from "../../../core/http/request-validator.js";

import { requireBoolean } from "../../../core/http/validators/require-boolean.validator.js";

import type { MuteChatRequestDto } from "../dto/request/mute-chat-request.dto.js";

export class MuteChatRequestValidator implements RequestValidator<MuteChatRequestDto> {
  validate(request: Request): MuteChatRequestDto {
    return {
      isMuted: requireBoolean(
        request.body.isMuted,

        "isMuted",
      ),
    };
  }
}
