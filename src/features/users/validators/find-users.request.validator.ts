import { ValidationError } from "../../../core/errors/index.js";

import type { FindUsersDto } from "../dto/find-users.dto.js";

export class FindUsersRequestValidator {
  validate(query: unknown): FindUsersDto {
    const result: FindUsersDto = {
      limit: 20,
      offset: 0,
    };

    if (!query || typeof query !== "object") {
      return result;
    }

    const source = query as Record<string, unknown>;

    if (source.query !== undefined) {
      if (typeof source.query !== "string") {
        throw new ValidationError("Query must be a string.");
      }

      const value = source.query.trim();

      if (value.length > 0) {
        result.query = value;
      }
    }

    if (source.limit !== undefined) {
      const limit = Number(source.limit);

      if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        throw new ValidationError("Limit must be between 1 and 100.");
      }

      result.limit = limit;
    }

    if (source.offset !== undefined) {
      const offset = Number(source.offset);

      if (!Number.isInteger(offset) || offset < 0) {
        throw new ValidationError("Offset must be greater than or equal to 0.");
      }

      result.offset = offset;
    }

    return result;
  }
}
