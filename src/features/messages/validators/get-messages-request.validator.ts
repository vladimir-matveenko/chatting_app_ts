import type { Request } from "express";

import { ValidationError } from "../../../core/errors/index.js";

import type { GetMessagesRequestDto } from "../dto/request/get-messages.request.dto.js";
import { MessagesMode } from "../enums/message-mode.enum.js";

export class GetMessagesRequestValidator {
  validate(request: Request): GetMessagesRequestDto {
    const limit = Number(request.query.limit ?? 10);

    if (!Number.isInteger(limit) || limit <= 0) {
      throw new ValidationError("Invalid limit.");
    }

    const beforeMessageId =
      typeof request.query.beforeMessageId === "string" ? request.query.beforeMessageId : undefined;

    const afterMessageId =
      typeof request.query.afterMessageId === "string" ? request.query.afterMessageId : undefined;

    const aroundMessageId =
      typeof request.query.aroundMessageId === "string" ? request.query.aroundMessageId : undefined;

    const before = request.query.before == null ? undefined : Number(request.query.before);

    const after = request.query.after == null ? undefined : Number(request.query.after);

    if (before != null && (!Number.isInteger(before) || before < 0)) {
      throw new ValidationError("Invalid before.");
    }

    if (after != null && (!Number.isInteger(after) || after < 0)) {
      throw new ValidationError("Invalid after.");
    }

    let anchors = 0;

    if (beforeMessageId) {
      anchors++;
    }

    if (afterMessageId) {
      anchors++;
    }

    if (aroundMessageId) {
      anchors++;
    }

    if (anchors > 1) {
      throw new ValidationError("Only one anchor parameter is allowed.");
    }

    if (aroundMessageId != null) {
      return {
        mode: MessagesMode.AROUND,
        anchorMessageId: aroundMessageId,
        before: before ?? 10,
        after: after ?? 10,
        limit,
      };
    }

    if (beforeMessageId != null) {
      return {
        mode: MessagesMode.BEFORE,
        anchorMessageId: beforeMessageId,
        limit,
      };
    }

    if (afterMessageId != null) {
      return {
        mode: MessagesMode.AFTER,
        anchorMessageId: afterMessageId,
        limit,
      };
    }

    return {
      mode: MessagesMode.LATEST,
      limit,
    };
  }
}
