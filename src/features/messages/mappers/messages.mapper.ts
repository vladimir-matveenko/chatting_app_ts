import type { Mapper } from "../../../core/mappers/mapper.js";

import type { MessageEntity } from "../entities/message.entity.js";

import type { Message } from "../models/message.model.js";

export class MessagesMapper implements Mapper<MessageEntity, Message> {
  map(entity: MessageEntity): Message {
    return {
      id: entity.id,

      chatId: entity.chat_id,

      sender: {
        id: entity.sender_id,

        userName: entity.sender_user_name,

        displayName: entity.sender_display_name,

        avatarUrl: entity.sender_avatar_url,
      },

      type: entity.type,

      body: entity.body,

      replyToId: entity.reply_to_id,

      deletedAt: entity.deleted_at,

      createdAt: entity.created_at,

      updatedAt: entity.updated_at,

      isDeleted: entity.is_deleted,

      reply: entity.reply_id
        ? {
            id: entity.reply_id,

            sender: {
              id: entity.reply_sender_id as string,

              userName: entity.reply_sender_user_name as string,

              displayName: entity.reply_sender_display_name,

              avatarUrl: entity.reply_sender_avatar_url,
            },

            type: entity.reply_type as NonNullable<MessageEntity["reply_type"]>,

            body: entity.reply_body,

            deletedAt: entity.reply_deleted_at,
          }
        : null,

      reactions: entity.reactions ?? [],

      currentUserReaction: entity.current_user_reaction,

      readCount: entity.read_count,
    };
  }
}
