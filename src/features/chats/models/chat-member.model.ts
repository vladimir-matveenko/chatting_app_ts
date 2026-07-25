import { ChatMemberRole } from "../enums/chat-member-role.enum.js";

export interface ChatMember {
  chatId: string;

  userId: string;

  role: ChatMemberRole;

  joinedAt: Date;

  isMuted: boolean;

  isArchived: boolean;

  userName: string;

  displayName: string | null;

  avatarUrl: string | null;

  isOnline: boolean;
}
