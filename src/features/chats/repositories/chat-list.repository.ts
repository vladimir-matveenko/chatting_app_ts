import {
    BaseRepository,
} from "../../../core/database/base.repository.js";

import type {
    Database,
} from "../../../core/database/database.js";

import type {
    ChatListItemEntity,
} from "../entities/chat-list-item.entity.js";

import type {
    ChatListItem,
} from "../models/chat-list-item.model.js";

import {
    ChatListItemMapper,
} from "../mappers/chat-list-item.mapper.js";

import {
    ChatsQueries,
} from "../queries/chats.queries.js";

import type {
    IChatListRepository,
} from "../interfaces/chat-list.repository.interface.js";

export class ChatListRepository

    extends BaseRepository<
        ChatListItemEntity,
        ChatListItem
    >

    implements IChatListRepository {

    constructor(

        database: Database,

        mapper: ChatListItemMapper,

    ) {

        super(

            database,

            mapper,

        );

    }

    async findByUser(

        userId: string,

    ): Promise<ChatListItem[]> {

        return this.findMany(

            ChatsQueries.FIND_ALL_BY_USER,

            [

                userId,

            ],

        );

    }

}