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

      isMuted: entity.is_muted,

      isArchived: entity.is_archived,

      userName: entity.user_name,

      displayName: entity.display_name,

      avatarUrl: entity.avatar_url,
    };
  }
}
