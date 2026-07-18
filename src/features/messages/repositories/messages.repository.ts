import { PoolClient } from "pg";
import { BaseRepository } from "../../../core/database/base.repository.js";

import { Database } from "../../../core/database/database.js";

import type { CreateMessageDto } from "../dto/create-message.dto.js";

import type { MessageEntity } from "../entities/message.entity.js";

import type { IMessagesRepository } from "../interfaces/messages.repository.interface.js";

import { MessagesMapper } from "../mappers/messages.mapper.js";

import type { Message } from "../models/message.model.js";

import { MessagesQueries } from "../queries/messages.queries.js";

export class MessagesRepository
  extends BaseRepository<MessageEntity, Message>
  implements IMessagesRepository
{
  constructor(
    database: Database,

    mapper: MessagesMapper,
  ) {
    super(
      database,

      mapper,
    );
  }

  async create(dto: CreateMessageDto): Promise<Message> {
    return this.saveOne(
      MessagesQueries.CREATE,

      [dto.chatId, dto.senderId, dto.type, dto.body, dto.replyToId],
    );
  }

  async createTx(
    client: PoolClient,

    dto: CreateMessageDto,
  ): Promise<Message> {
    return this.saveOneTx(
      client,

      MessagesQueries.CREATE,

      [dto.chatId, dto.senderId, dto.type, dto.body, dto.replyToId],
    );
  }

  async findById(id: string): Promise<Message | null> {
    return this.findOne(
      MessagesQueries.FIND_BY_ID,

      [id],
    );
  }

  async findByChat(
    chatId: string,

    userId: string,

    limit: number,

    before?: Date,
  ): Promise<Message[]> {
    return this.findMany(
      MessagesQueries.FIND_BY_CHAT,

      [chatId, userId, before ?? null, limit],
    );
  }

  async update(
    id: string,

    body: string,
  ): Promise<Message> {
    return this.saveOne(
      MessagesQueries.UPDATE,

      [id, body],
    );
  }

  async delete(id: string): Promise<Message> {
    return this.saveOne(
      MessagesQueries.DELETE,

      [id],
    );
  }

  async pin(messageId: string): Promise<Message> {
    return this.saveOne(
      MessagesQueries.PIN_MESSAGE,

      [messageId],
    );
  }

  async unpin(messageId: string): Promise<Message> {
    return this.saveOne(
      MessagesQueries.UNPIN_MESSAGE,

      [messageId],
    );
  }

  async findPinned(chatId: string): Promise<Message[]> {
    return this.findMany(
      MessagesQueries.FIND_PINNED_BY_CHAT,

      [chatId],
    );
  }
}
