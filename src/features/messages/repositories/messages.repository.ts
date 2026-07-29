import { PoolClient } from "pg";
import { BaseRepository } from "../../../core/database/base.repository.js";

import { Database } from "../../../core/database/database.js";

import type { CreateMessageDto } from "../dto/create-message.dto.js";

import type { MessageEntity } from "../entities/message.entity.js";

import type { IMessagesRepository } from "../interfaces/messages.repository.interface.js";

import { MessagesMapper } from "../mappers/messages.mapper.js";

import type { Message } from "../models/message.model.js";

import { MessagesQueries } from "../queries/messages.queries.js";
import { NotFoundError } from "../../../core/errors/index.js";

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
    const result = await this.saveOne(
      MessagesQueries.CREATE,

      [dto.chatId, dto.senderId, dto.type, dto.body, dto.replyToId],
    );

    return this.getByIdOrThrow(result.id);
  }

  async createTx(
    client: PoolClient,

    dto: CreateMessageDto,
  ): Promise<Message> {
    const result = await this.saveOneTx(
      client,

      MessagesQueries.CREATE,

      [dto.chatId, dto.senderId, dto.type, dto.body, dto.replyToId],
    );

    return this.getByIdOrThrowTx(client, result.id);
  }

  async findById(id: string): Promise<Message | null> {
    return this.findOne(
      MessagesQueries.FIND_BY_ID,

      [id],
    );
  }

  async findByIdTx(client: PoolClient, id: string): Promise<Message | null> {
    return this.findOneTx(client, MessagesQueries.FIND_BY_ID, [id]);
  }

  async getByIdOrThrowTx(client: PoolClient, id: string): Promise<Message> {
    const message = await this.findByIdTx(client, id);

    if (!message) {
      throw new NotFoundError("Message not found.", "MESSAGE_NOT_FOUND");
    }

    return message;
  }

  async update(
    id: string,

    body: string,
  ): Promise<Message> {
    await this.saveOne(
      MessagesQueries.UPDATE,

      [id, body],
    );

    return this.getByIdOrThrow(id);
  }

  async delete(id: string): Promise<Message> {
    await this.saveOne(
      MessagesQueries.DELETE,

      [id],
    );

    return this.getByIdOrThrow(id);
  }

  async pin(messageId: string): Promise<Message> {
    await this.saveOne(
      MessagesQueries.PIN_MESSAGE,

      [messageId],
    );

    return this.getByIdOrThrow(messageId);
  }

  async unpin(messageId: string): Promise<Message> {
    await this.saveOne(
      MessagesQueries.UNPIN_MESSAGE,

      [messageId],
    );

    return this.getByIdOrThrow(messageId);
  }

  async findPinned(chatId: string, currentUserId: string): Promise<Message[]> {
    return this.findMany(
      MessagesQueries.FIND_PINNED_BY_CHAT,

      [chatId, currentUserId],
    );
  }

  async getByIdOrThrow(id: string): Promise<Message> {
    const message = await this.findById(id);

    if (!message) {
      throw new NotFoundError(
        "Message not found.",

        "MESSAGE_NOT_FOUND",
      );
    }

    return message;
  }

  // get list of messages
  async findLatest(chatId: string, currentUserId: string, limit: number): Promise<Message[]> {
    return this.findMany(MessagesQueries.FIND_LATEST, [chatId, currentUserId, limit]);
  }

  async findBefore(
    chatId: string,
    currentUserId: string,
    beforeMessageId: string,
    limit: number,
  ): Promise<Message[]> {
    return this.findMany(MessagesQueries.FIND_BEFORE, [
      chatId,
      currentUserId,
      beforeMessageId,
      limit,
    ]);
  }

  async findAfter(
    chatId: string,
    currentUserId: string,
    afterMessageId: string,
    limit: number,
  ): Promise<Message[]> {
    const messages = await this.findMany(MessagesQueries.FIND_AFTER, [
      chatId,
      currentUserId,
      afterMessageId,
      limit,
    ]);

    return messages.reverse();
  }

  async findAroundMessage(
    chatId: string,
    messageId: string,
    currentUserId: string,
    before: number,
    after: number,
  ): Promise<Message[]> {
    return this.findMany(MessagesQueries.FIND_AROUND_MESSAGE, [
      chatId,
      messageId,
      currentUserId,
      before,
      after,
    ]);
  }

  async hasMessagesBefore(chatId: string, messageId: string): Promise<boolean> {
    const result = await this.db.query(MessagesQueries.HAS_MESSAGES_BEFORE, [chatId, messageId]);

    return (result.rowCount ?? 0) > 0;
  }

  async hasMessagesAfter(chatId: string, messageId: string): Promise<boolean> {
    const result = await this.db.query(MessagesQueries.HAS_MESSAGES_AFTER, [chatId, messageId]);

    return (result.rowCount ?? 0) > 0;
  }
}
