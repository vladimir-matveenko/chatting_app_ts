import { ValidationError } from "../../../core/errors/index.js";

import type { AddReactionRequestDto } from "../dto/request/add-reaction.request.dto.js";

import { ReactionType } from "../enums/reaction-type.enum.js";

export class AddReactionRequestValidator {
  validate(body: unknown): AddReactionRequestDto {
    if (!body || typeof body !== "object") {
      throw new ValidationError("Request body is required.");
    }

    const dto = body as Partial<AddReactionRequestDto>;

    if (!dto.type || !Object.values(ReactionType).includes(dto.type)) {
      throw new ValidationError("Invalid reaction type.");
    }

    return {
      type: dto.type,
    };
  }
}
