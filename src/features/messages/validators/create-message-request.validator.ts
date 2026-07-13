import type { Request } from "express";

import { ValidationError } from "../../../core/errors/index.js";

import type { CreateMessageRequestDto } from "../dto/request/create-message.request.dto.js";

import { MessageType } from "../enums/message-type.enum.js";

export class CreateMessageRequestValidator {
  validate(request: Request): CreateMessageRequestDto {
    const dto = request.body as CreateMessageRequestDto;
    console.log(dto.body);

    if (!Object.values(MessageType).includes(dto.type)) {
      throw new ValidationError("Invalid message type.");
    }

    if (dto.type === MessageType.TEXT && (!dto.body || dto.body.trim().length === 0)) {
      throw new ValidationError("Text message cannot be empty.");
    }

    return dto;
  }
}
