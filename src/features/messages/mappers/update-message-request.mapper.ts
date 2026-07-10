import type { UpdateMessageDto } from "../dto/update-message.dto.js";

import type { UpdateMessageRequestDto } from "../dto/request/update-message.request.dto.js";

export class UpdateMessageRequestMapper {
  map(
    dto: UpdateMessageRequestDto,

    id: string,

    userId: string,
  ): UpdateMessageDto {
    return {
      id,

      userId,

      body: dto.body,
    };
  }
}
