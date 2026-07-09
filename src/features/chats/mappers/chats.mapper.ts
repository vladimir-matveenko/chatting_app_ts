import { Mapper } from "../../../core/mappers/mapper.js";

import type { ChatEntity } from "../entities/chat.entity.js";

import type { Chat } from "../models/chat.model.js";

export class ChatMapper implements Mapper<ChatEntity, Chat> {
  map(entity: ChatEntity): Chat {
    return {
      id: entity.id,

      type: entity.type,

      title: entity.title,

      avatarUrl: entity.avatar_url,

      ownerId: entity.owner_id,

      createdAt: entity.created_at,

      updatedAt: entity.updated_at,
    };
  }
}
