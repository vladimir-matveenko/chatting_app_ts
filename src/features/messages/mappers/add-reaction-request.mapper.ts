import type { AddReactionDto } from "../dto/add-reaction.dto.js";

import type { AddReactionRequestDto } from "../dto/request/add-reaction.request.dto.js";

export class AddReactionRequestMapper {
  map(
    request: AddReactionRequestDto,

    messageId: string,

    userId: string,
  ): AddReactionDto {
    return {
      messageId,

      userId,

      type: request.type,
    };
  }
}
