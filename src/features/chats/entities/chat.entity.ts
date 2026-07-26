import { ChatType } from "../enums/chat-type.enum.js";

export interface ChatEntity {
  id: string;

  type: ChatType;

  title: string | null;

  avatar_url: string | null;

  owner_id: string | null;

  last_read_message_id: string | null;

  created_at: Date;

  updated_at: Date;
}
