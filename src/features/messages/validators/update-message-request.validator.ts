import { ValidationError } from "../../../core/errors/index.js";

import type { UpdateMessageRequestDto } from "../dto/request/update-message.request.dto.js";

export class UpdateMessageRequestValidator {
  validate(body: unknown): UpdateMessageRequestDto {
    if (typeof body !== "object" || body === null) {
      throw new ValidationError("Request body is required.");
    }

    const dto = body as UpdateMessageRequestDto;

    if (typeof dto.body !== "string") {
      throw new ValidationError("Body is required.");
    }

    if (dto.body.trim().length === 0) {
      throw new ValidationError("Message body cannot be empty.");
    }

    return {
      body: dto.body.trim(),
    };
  }
}
