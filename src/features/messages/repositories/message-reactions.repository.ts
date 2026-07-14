import { BaseRepository } from "../../../core/database/base.repository.js";

import type { Database } from "../../../core/database/database.js";

import type { MessageReactionEntity } from "../entities/message-reaction.entity.js";

import type { IMessageReactionsRepository } from "../interfaces/message-reactions.repository.interface.js";

import type { MessageReactionMapper } from "../mappers/message-reaction.mapper.js";

import type { MessageReaction } from "../models/message-reaction.model.js";

import type { AddReactionDto } from "../dto/add-reaction.dto.js";

import type { ReactionType } from "../enums/reaction-type.enum.js";

import { MessageReactionsQueries } from "../queries/message-reactions.queries.js";

export class MessageReactionsRepository
  extends BaseRepository<MessageReactionEntity, MessageReaction>
  implements IMessageReactionsRepository
{
  constructor(
    database: Database,

    mapper: MessageReactionMapper,
  ) {
    super(
      database,

      mapper,
    );
  }

  async add(dto: AddReactionDto): Promise<MessageReaction> {
    return this.saveOne(
      MessageReactionsQueries.ADD,

      [dto.messageId, dto.userId, dto.type],
    );
  }

  async findByMessageAndUser(
    messageId: string,

    userId: string,
  ): Promise<MessageReaction | null> {
    return this.findOne(
      MessageReactionsQueries.FIND_BY_MESSAGE_AND_USER,

      [messageId, userId],
    );
  }

  async update(
    reactionId: string,

    type: ReactionType,
  ): Promise<MessageReaction> {
    return this.saveOne(
      MessageReactionsQueries.UPDATE,

      [reactionId, type],
    );
  }

  async delete(reactionId: string): Promise<void> {
    await this.db.query(
      MessageReactionsQueries.DELETE,

      [reactionId],
    );
  }

  async refreshMessageReactions(messageId: string): Promise<void> {
    await this.db.query(MessageReactionsQueries.UPDATE_MESSAGE_REACTIONS_CACHE, [messageId]);
  }
}
