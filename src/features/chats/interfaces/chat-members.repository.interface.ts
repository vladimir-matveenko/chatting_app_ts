import type {
    ChatMemberEntity,
} from "../entities/chat-member.entity.js";

import type {
    CreateChatMemberDto,
} from "../dto/create-chat-member.dto.js";

import type {
    PoolClient,
} from "pg";
import { ChatMember } from "../models/chat-member.model.js";

export interface IChatMembersRepository {

    add(

        dto: CreateChatMemberDto,

    ): Promise<ChatMember>;

    addMany(

        members: CreateChatMemberDto[],

    ): Promise<void>;

    addTx(

        client: PoolClient,

        dto: CreateChatMemberDto,

    ): Promise<ChatMember>;

    findByChat(
        chatId: string,
    ): Promise<ChatMember[]>;

    isMember(

        chatId: string,

        userId: string,

    ): Promise<boolean>;

}