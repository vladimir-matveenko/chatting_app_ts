import type { Request } from "express";

import type { RequestValidator } from "../../../core/http/request-validator.js";

import type { AddChatMembersRequestDto } from "../dto/request/add-chat-members.request.dto.js";

import { ValidationError } from "../../../core/errors/index.js";

import { requireId } from "../../../core/http/validators/require-id.validator.js";

export class AddChatMembersRequestValidator implements RequestValidator<AddChatMembersRequestDto> {
  validate(request: Request): AddChatMembersRequestDto {
    if (!Array.isArray(request.body.memberIds)) {
      throw new ValidationError("memberIds must be array.");
    }

    if (request.body.memberIds.length === 0) {
      throw new ValidationError("memberIds cannot be empty.");
    }

    return {
      memberIds: request.body.memberIds.map((id: unknown) => requireId(id, "memberId")),
    };
  }
}
