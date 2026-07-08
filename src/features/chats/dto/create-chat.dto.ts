import type {
    ChatType,
} from "../entities/chat-type.enum.js";

export interface CreateChatDto {

    type: ChatType;

    fingerprint: string;

    title: string | null;

    avatarUrl: string | null;

    ownerId: string;

    memberIds: string[];

}