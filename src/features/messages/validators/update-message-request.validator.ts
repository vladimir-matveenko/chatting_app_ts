import type { Request } from "express";

import type { RequestValidator } from "../../../core/http/request-validator.js";

import { requireString } from "../../../core/http/validators/index.js";

import { ValidationConstants } from "../../../core/validation/validation.constants.js";

import type { UpdateMessageRequestDto } from "../dto/request/update-message.request.dto.js";

export class UpdateMessageRequestValidator implements RequestValidator<UpdateMessageRequestDto> {
  validate(request: Request): UpdateMessageRequestDto {
    return {
      body: requireString(
        request.body.body,

        "body",

        {
          maxLength: ValidationConstants.Message.Text.MaxLength,
        },
      ),
    };
  }
}
