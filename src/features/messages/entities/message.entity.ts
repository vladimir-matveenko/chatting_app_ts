import type { MessageType } from "../enums/message-type.enum.js";

export interface MessageEntity {
  id: string;

  chat_id: string;

  sender_id: string;

  type: MessageType;

  body: string | null;

  reply_to_id: string | null;

  edited_at: Date | null;

  created_at: Date;

  updated_at: Date;
}
