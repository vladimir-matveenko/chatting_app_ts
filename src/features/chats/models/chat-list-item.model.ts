import { ChatType } from "../enums/chat-type.enum.js";

export interface ChatListItem {
  id: string;

  type: ChatType;

  title: string | null;

  avatarUrl: string | null;

  ownerId: string | null;

  createdAt: Date;

  updatedAt: Date;

  lastMessage: string | null;

  lastMessageAt: Date | null;

  unreadCount: number;
}
