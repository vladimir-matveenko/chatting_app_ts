import type { CreateMessageDto } from "../dto/create-message.dto.js";

import type { CreateMessageRequestDto } from "../dto/request/create-message.request.dto.js";

export class CreateMessageRequestMapper {
  map(
    request: CreateMessageRequestDto,

    chatId: string,

    senderId: string,
  ): CreateMessageDto {
    return {
      chatId,

      senderId,

      type: request.type,

      body: request.body,

      replyToId: request.replyToId ?? null,
    };
  }
}
