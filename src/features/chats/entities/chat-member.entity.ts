import { ChatMemberRole }
    from "./chat-member-role.enum.js";

export interface ChatMemberEntity {

    chatId: string;

    userId: string;

    role: ChatMemberRole;

    joinedAt: Date;

    lastReadMessageId: string | null;

    isMuted: boolean;

    isArchived: boolean;

}