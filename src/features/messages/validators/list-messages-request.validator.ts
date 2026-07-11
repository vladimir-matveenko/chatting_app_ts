import { ValidationError } from "../../../core/errors/index.js";

import type { ListMessagesRequestDto } from "../dto/request/list-messages.request.dto.js";

export class ListMessagesRequestValidator {
  validate(query: unknown): ListMessagesRequestDto {
    if (!query || typeof query !== "object") {
      return {};
    }

    const dto = query as Partial<ListMessagesRequestDto>;

    const result: ListMessagesRequestDto = {};

    if (dto.before !== undefined) {
      result.before = dto.before;
    }

    if (dto.limit !== undefined) {
      const limit = Number(dto.limit);

      if (limit < 1 || limit > 100) {
        throw new ValidationError("Limit must be between 1 and 100.");
      }

      result.limit = limit;
    }

    return result;
  }
}
