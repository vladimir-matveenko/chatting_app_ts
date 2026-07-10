import type { Mapper } from "../../../core/mappers/mapper.js";

import type { MessageReactionEntity } from "../entities/message-reaction.entity.js";

import type { MessageReaction } from "../models/message-reaction.model.js";

export class MessageReactionMapper implements Mapper<MessageReactionEntity, MessageReaction> {
  map(entity: MessageReactionEntity): MessageReaction {
    return {
      id: entity.id,

      messageId: entity.message_id,

      userId: entity.user_id,

      type: entity.type,

      createdAt: entity.created_at,
    };
  }
}
