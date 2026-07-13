import { ChatMemberRole } from "../enums/chat-member-role.enum.js";

export interface ChatMember {
  chatId: string;

  userId: string;

  role: ChatMemberRole;

  joinedAt: Date;

  lastReadMessageId: string | null;

  isMuted: boolean;

  isArchived: boolean;
}
