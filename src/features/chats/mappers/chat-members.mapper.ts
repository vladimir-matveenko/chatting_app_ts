import type { Mapper } from "../../../core/mappers/mapper.js";

import type { ChatMemberEntity } from "../entities/chat-member.entity.js";

import type { ChatMember } from "../models/chat-member.model.js";

export class ChatMembersMapper implements Mapper<ChatMemberEntity, ChatMember> {
  map(entity: ChatMemberEntity): ChatMember {
    return {
      chatId: entity.chat_id,

      userId: entity.user_id,

      role: entity.role,

      joinedAt: entity.joined_at,

      lastReadMessageId: entity.last_read_message_id === null ? null : entity.last_read_message_id,

      isMuted: entity.is_muted,

      isArchived: entity.is_archived,
    };
  }
}
