import type { Mapper } from "../../../core/mappers/mapper.js";
import { MessageType } from "../../messages/enums/message-type.enum.js";

import type { ChatListItemEntity } from "../entities/chat-list-item.entity.js";

import type { ChatListItem } from "../models/chat-list-item.model.js";

export class ChatListItemMapper implements Mapper<ChatListItemEntity, ChatListItem> {
  private buildMessagePreview(
    body: string | null,

    type: MessageType | null,
  ): string | null {
    if (!type) {
      return null;
    }

    switch (type) {
      case MessageType.TEXT:
        return body;

      case MessageType.IMAGE:
        return "📷 Photo";

      case MessageType.VIDEO:
        return "🎬 Video";

      case MessageType.AUDIO:
        return "🎤 Voice message";

      case MessageType.FILE:
        return "📄 Document";

      case MessageType.SYSTEM:
        return body;

      default:
        return body;
    }
  }

  map(entity: ChatListItemEntity): ChatListItem {
    return {
      id: entity.id,

      type: entity.type,

      title: entity.title,

      avatarUrl: entity.avatar_url,

      ownerId: entity.owner_id,

      createdAt: entity.created_at,

      updatedAt: entity.updated_at,

      lastMessagePreview: this.buildMessagePreview(
        entity.last_message,

        entity.last_message_type,
      ),

      lastMessageAt: entity.last_message_at,

      unreadCount: entity.unread_count,

      participants: entity.participants,

      participantsCount: entity.participants_count,
    };
  }
}
