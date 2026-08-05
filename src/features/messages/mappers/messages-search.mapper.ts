import { Mapper } from "../../../core/mappers/mapper.js";
import type { MessageSearchEntity } from "../entities/message-search.entity.js";
import { MessageSearchResult } from "../models/message-search.model.js";

export class MessagesSearchMapper implements Mapper<MessageSearchEntity, MessageSearchResult> {
  map(entity: MessageSearchEntity): MessageSearchResult {
    return {
      messageId: entity.message_id,

      chatId: entity.chat_id,

      type: entity.type,

      body: entity.body,

      createdAt: entity.created_at,

      sender: {
        id: entity.sender_id,

        userName: entity.sender_user_name,

        displayName: entity.sender_display_name,

        avatarUrl: entity.sender_avatar_url,
      },
    };
  }

  mapMany(entities: MessageSearchEntity[]): MessageSearchResult[] {
    return entities.map((e) => this.map(e));
  }
}
