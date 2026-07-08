import type {
    Chat,
} from "../models/chat.model.js";

import type {
    ChatDetails,
} from "../models/chat-details.model.js";

export class ChatDetailsMapper {

    map(

        chat: Chat,

    ): ChatDetails {

        return {

            id:
                chat.id,

            type:
                chat.type,

            title:
                chat.title,

            avatarUrl:
                chat.avatarUrl,

            ownerId:
                chat.ownerId,

            createdAt:
                chat.createdAt,

            updatedAt:
                chat.updatedAt,

        };

    }

}