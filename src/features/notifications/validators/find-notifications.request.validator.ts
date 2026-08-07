import { ValidationError } from "../../../core/errors/index.js";
import { FindNotificationsDto } from "../dto/find-notifications.dto.js";
import { NotificationType } from "../enums/notification-type.enum.js";

export class FindNotificationsRequestValidator {
  validate(query: unknown): FindNotificationsDto {
    const result: FindNotificationsDto = { limit: 20, offset: 0 };
    if (!query || typeof query !== "object") {
      return result;
    }
    const source = query as Record<string, unknown>;
    if (source.type !== undefined) {
      if (typeof source.type !== "string") {
        throw new ValidationError("Type must be a string.");
      }
      if (!Object.values(NotificationType).includes(source.type as NotificationType)) {
        throw new ValidationError("Invalid notification type.");
      }
      result.type = source.type as NotificationType;
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
