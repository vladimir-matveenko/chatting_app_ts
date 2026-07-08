import type {
    CreateChatDto,
} from "../dto/create-chat.dto.js";
import { ChatListItemEntity } from "../entities/chat-list-item.entity.js";

import type {
    ChatEntity,
} from "../entities/chat.entity.js";

import type {
    PoolClient,
} from "pg";
import { ChatListItem } from "../models/chat-list-item.model.js";

export interface IChatsRepository {

    create(
        dto: CreateChatDto,
    ): Promise<ChatEntity>;

    findByFingerprint(

        fingerprint: string,

    ): Promise<ChatEntity | null>;

    findByFingerprintTx(

        client: PoolClient,

        fingerprint: string,

    ): Promise<ChatEntity | null>;

    findById(

        id: string,

    ): Promise<ChatEntity | null>;

    findAllByUser(

        userId: string,

    ): Promise<ChatEntity[]>;

    createTx(

        client: PoolClient,

        dto: CreateChatDto,

    ): Promise<ChatEntity>;

}