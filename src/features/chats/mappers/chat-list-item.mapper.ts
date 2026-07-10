import type { Mapper } from "../../../core/mappers/mapper.js";

import type { ChatListItemEntity } from "../entities/chat-list-item.entity.js";

import type { ChatListItem } from "../models/chat-list-item.model.js";

export class ChatListItemMapper implements Mapper<ChatListItemEntity, ChatListItem> {
  map(entity: ChatListItemEntity): ChatListItem {
    return {
      id: entity.id,

      type: entity.type,

      title: entity.title,

      avatarUrl: entity.avatar_url,

      ownerId: entity.owner_id,

      createdAt: entity.created_at,

      updatedAt: entity.updated_at,

      lastMessage: entity.last_message,

      lastMessageAt: entity.last_message_at,

      unreadCount: entity.unread_count,
    };
  }
}
