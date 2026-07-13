import type { MessageType } from "../enums/message-type.enum.js";

import type { MessageReply } from "./message-reply.model.js";

export interface Message {
  id: string;

  chatId: string;

  senderId: string;

  type: MessageType;

  body: string | null;

  replyToId: string | null;

  deletedAt: Date | null;

  createdAt: Date;

  updatedAt: Date;

  isDeleted: boolean;

  reply: MessageReply | null;
}
