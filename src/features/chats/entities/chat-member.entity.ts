import { ChatMemberRole } from "../enums/chat-member-role.enum.js";

export interface ChatMemberEntity {
  chat_id: string;

  user_id: string;

  role: ChatMemberRole;

  joined_at: Date;

  is_muted: boolean;

  is_archived: boolean;

  user_name: string;

  display_name: string | null;

  avatar_url: string | null;
}
