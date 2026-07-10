import type { MessageType } from "../enums/message-type.enum.js";

export interface Message {
  id: string;

  chatId: string;

  senderId: string;

  type: MessageType;

  body: string | null;

  replyToId: string | null;

  editedAt: Date | null;

  deletedAt: Date | null;

  createdAt: Date;

  updatedAt: Date;

  isDeleted: boolean;
}
