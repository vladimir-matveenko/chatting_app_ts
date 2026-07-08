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

            chatId:
                model.chat_id.toString(),

            userId:
                model.user_id.toString(),

            role:
                model.role as ChatMemberRole,

            joinedAt:
                model.joined_at,

            lastReadMessageId:
                model.last_read_message_id?.toString()
                ?? null,

            isMuted:
                model.is_muted,

            isArchived:
                model.is_archived,

        };

    }

}