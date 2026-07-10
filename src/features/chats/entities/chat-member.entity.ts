import { ChatMemberRole } from "../enums/chat-member-role.enum.js";

export interface ChatMemberEntity {
  chat_id: string;

  user_id: string;

  role: ChatMemberRole;

  joined_at: Date;

  last_read_message_id: string | null;

  is_muted: boolean;

  is_archived: boolean;
}
