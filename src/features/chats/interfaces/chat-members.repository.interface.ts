import type {
    ChatMemberEntity,
} from "../entities/chat-member.entity.js";

import type {
    CreateChatMemberDto,
} from "../dto/create-chat-member.dto.js";

import type {
    PoolClient,
} from "pg";

export interface IChatMembersRepository {

    add(

        dto: CreateChatMemberDto,

    ): Promise<ChatMemberEntity>;

    addMany(

        members: CreateChatMemberDto[],

    ): Promise<void>;

    addTx(

        client: PoolClient,

        dto: CreateChatMemberDto,

    ): Promise<ChatMemberEntity>;

}