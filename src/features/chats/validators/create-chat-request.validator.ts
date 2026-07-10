import type { Request } from "express";

import type { RequestValidator } from "../../../core/http/request-validator.js";

import {
  requireArray,
  requireEnum,
  requireId,
  requireNullableString,
  requireNullableUrl,
} from "../../../core/http/validators/index.js";

import type { CreateChatRequestDto } from "../dto/request/create-chat.request.dto.js";

import { ChatType } from "../enums/chat-type.enum.js";

export class CreateChatRequestValidator implements RequestValidator<CreateChatRequestDto> {
  validate(request: Request): CreateChatRequestDto {
    return {
      type: requireEnum(
        request.body.type,

        ChatType,

        "type",
      ),

      title: requireNullableString(
        request.body.title,

        "title",
      ),

      avatarUrl: requireNullableUrl(
        request.body.avatarUrl,

        "avatarUrl",
      ),

      memberIds: requireArray(
        request.body.memberIds,

        "memberIds",

        requireId,
      ),
    };
  }
}
