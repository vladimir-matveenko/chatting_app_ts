import { ChatType } from "../enums/chat-type.enum.js";
import { ChatListParticipant } from "./chat-list-participant.model.js";

export interface ChatListItem {
  id: string;

  type: ChatType;

  title: string | null;

  avatarUrl: string | null;

  ownerId: string | null;

  createdAt: Date;

  updatedAt: Date;

  lastMessageId: string | null;

  lastMessagePreview: string | null;

  lastMessageAt: Date | null;

  unreadCount: number;

  lastReadMessageId: string | null;

  participants: ChatListParticipant[];

  participantsCount: number;
}
