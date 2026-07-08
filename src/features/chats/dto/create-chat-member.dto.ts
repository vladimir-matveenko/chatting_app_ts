import type {
    ChatMemberRole,
} from "./../entities/chat-member-role.enum.js";

export interface CreateChatMemberDto {

    chatId: string;

    userId: string;

    role: ChatMemberRole;

}