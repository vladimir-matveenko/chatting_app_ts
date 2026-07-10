import type { MessageType } from "../enums/message-type.enum.js";

export interface CreateMessageDto {
  chatId: string;

  senderId: string;

  type: MessageType;

  body: string | null;

  replyToId: string | null;
}
