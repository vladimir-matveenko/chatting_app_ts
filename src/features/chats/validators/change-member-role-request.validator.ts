import type { Request } from "express";

import { ValidationError } from "../../../core/errors/index.js";
import { RequestValidator } from "../../../core/http/request-validator.js";

import { ChatMemberRole } from "../enums/chat-member-role.enum.js";
import { ChangeMemberRoleRequestDto } from "../dto/request/change-member-role-request.dto.js";

export class ChangeMemberRoleRequestValidator implements RequestValidator<ChangeMemberRoleRequestDto> {
  validate(request: Request): ChangeMemberRoleRequestDto {
    const role = request.body.role;

    if (role !== ChatMemberRole.ADMIN && role !== ChatMemberRole.MEMBER) {
      throw new ValidationError("Invalid member role.");
    }

    return {
      role,
    };
  }
}
