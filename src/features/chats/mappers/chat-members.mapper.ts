import type {
    Mapper,
} from "../../../core/mappers/mapper.js";

import type {
    ChatMemberEntity,
} from "../entities/chat-member.entity.js";

import type {
    ChatMember,
} from "../models/chat-member.model.js";

import {
    ChatMemberRole,
} from "../entities/chat-member-role.enum.js";

export class ChatMembersMapper

    implements Mapper<ChatMember, ChatMemberEntity> {

    map(

        model: ChatMember,

    ): ChatMemberEntity {

        return {

            chat_id:
                model.chatId.toString(),

            user_id:
                model.userId.toString(),

            role:
                model.role as ChatMemberRole,

            joined_at:
                model.joinedAt,

            last_read_message_id:
                model.lastReadMessageId?.toString()
                ?? null,

            is_muted:
                model.isMuted,

            is_archived:
                model.isArchived,

        };

    }

}