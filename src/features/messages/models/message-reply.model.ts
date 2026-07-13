import type { MessageType } from "../enums/message-type.enum.js";

export interface MessageReply {
  id: string;

  senderId: string;

  body: string | null;

  type: MessageType;

  deletedAt: Date | null;
}
