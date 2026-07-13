import type { MessageType } from "../enums/message-type.enum.js";

export interface MessageEntity {
  id: string;

  chat_id: string;

  sender_id: string;

  type: MessageType;

  body: string | null;

  reply_to_id: string | null;

  deleted_at: Date | null;

  created_at: Date;

  updated_at: Date;

  is_deleted: boolean;

  reply_id: string | null;

  reply_sender_id: string | null;

  reply_body: string | null;

  reply_type: MessageType | null;

  reply_deleted_at: Date | null;
}
