export interface ChatMember {

    chatId: number;

    userId: number;

    role: string;

    joinedAt: Date;

    lastReadMessageId: number | null;

    isMuted: boolean;

    isArchived: boolean;

}