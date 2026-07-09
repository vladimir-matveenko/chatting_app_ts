export interface ChatMember {
  chatId: string;

  userId: string;

  role: string;

  joinedAt: Date;

  lastReadMessageId: string | null;

  isMuted: boolean;

  isArchived: boolean;
}
