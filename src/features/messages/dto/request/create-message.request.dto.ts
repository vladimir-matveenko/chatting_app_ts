import type { MessageType } from "../../enums/message-type.enum.js";

export interface CreateMessageRequestDto {
  type: MessageType;

  body: string | null;

  replyToId?: string;
}
