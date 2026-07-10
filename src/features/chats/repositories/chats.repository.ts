import { BaseRepository } from "../../../core/database/base.repository.js";

import { Database } from "../../../core/database/database.js";

import { InternalServerError } from "../../../core/errors/index.js";

import type { CreateChatDto } from "../dto/create-chat.dto.js";

import type { ChatEntity } from "../entities/chat.entity.js";

import type { IChatsRepository } from "../interfaces/chats.repository.interface.js";

import { ChatMapper } from "../mappers/chats.mapper.js";

import type { Chat } from "../models/chat.model.js";

import { ChatsQueries } from "../queries/chats.queries.js";

import type { PoolClient } from "pg";

export class ChatsRepository extends BaseRepository<ChatEntity, Chat> implements IChatsRepository {
  constructor(
    database: Database,

    mapper: ChatMapper,
  ) {
    super(
      database,

      mapper,
    );
  }

  async create(dto: CreateChatDto): Promise<Chat> {
    const entity = await this.queryOne(
      ChatsQueries.CREATE_CHAT,

      [dto.type, dto.fingerprint, dto.title, dto.avatarUrl, dto.ownerId],
    );

    if (!entity) {
      throw new InternalServerError(
        "Chat was not created.",

        "CHAT_CREATE_FAILED",
      );
    }

    return this.map(entity);
  }

  async findByFingerprint(fingerprint: string): Promise<Chat | null> {
    return this.findOne(
      ChatsQueries.FIND_BY_FINGERPRINT,

      [fingerprint],
    );
  }

  async findByFingerprintTx(
    client: PoolClient,

    fingerprint: string,
  ): Promise<Chat | null> {
    const entity = await this.queryOneTx(
      client,

      ChatsQueries.FIND_BY_FINGERPRINT,

      [fingerprint],
    );

    return this.mapNullable(entity);
  }

  async createTx(
    client: PoolClient,

    dto: CreateChatDto,
  ): Promise<Chat> {
    return this.saveOneTx(
      client,

      ChatsQueries.CREATE_CHAT,

      [dto.type, dto.fingerprint, dto.title, dto.avatarUrl, dto.ownerId],
    );
  }

  async findAllByUser(userId: string): Promise<Chat[]> {
    return this.findMany(
      ChatsQueries.FIND_ALL_BY_USER,

      [userId],
    );
  }

  async findById(id: string): Promise<Chat | null> {
    return this.findOne(
      ChatsQueries.FIND_BY_ID,

      [id],
    );
  }

  async updateActivityTx(
    client: PoolClient,

    chatId: string,
  ): Promise<void> {
    await this.queryTx(
      client,

      ChatsQueries.UPDATE_ACTIVITY,

      [chatId],
    );
  }
}
