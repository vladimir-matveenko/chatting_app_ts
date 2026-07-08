import { Mapper }
    from "../../../core/mappers/mapper.js";

import type {
    ChatEntity,
} from "../entities/chat.entity.js";

import type {
    Chat,
} from "../models/chat.model.js";

import { ChatType }
    from "../entities/chat-type.enum.js";

export class ChatMapper
    implements Mapper<Chat, ChatEntity> {

    map(
        model: Chat,
    ): ChatEntity {

        return {

            id:
                model.id.toString(),

            type:
                model.type as ChatType,

            title:
                model.title,

            avatarUrl:
                model.avatar_url,

            ownerId:
                model.owner_id?.toString()
                ?? null,

            createdAt:
                model.created_at,

            updatedAt:
                model.updated_at,

        };

    }

}