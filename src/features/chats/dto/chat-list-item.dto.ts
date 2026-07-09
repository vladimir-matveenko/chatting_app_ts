export interface ChatListItemDto {
  id: string;

  type: string;

  title: string | null;

  avatarUrl: string | null;

  ownerId: string;

  createdAt: Date;

  updatedAt: Date;

  lastMessage: string | null;

  lastMessageAt: Date | null;

  unreadCount: number;
}
