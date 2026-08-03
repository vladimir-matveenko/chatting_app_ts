import { MessageType } from "../enums/message-type.enum.js";

export interface MessageSearchEntity {
  message_id: string;

  chat_id: string;

  type: MessageType;

  body: string | null;

  created_at: Date;

  sender_id: string;

  sender_user_name: string;

  sender_display_name: string | null;

  sender_avatar_url: string | null;
}
