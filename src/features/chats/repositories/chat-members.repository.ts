import { BaseRepository } from "../../../core/database/base.repository.js";

import { Database } from "../../../core/database/database.js";

import { InternalServerError } from "../../../core/errors/index.js";

import type { ChatMemberEntity } from "../entities/chat-member.entity.js";

import type { ChatMember } from "../models/chat-member.model.js";

import { ChatMembersMapper } from "../mappers/chat-members.mapper.js";

import { ChatMembersQueries } from "../queries/chat-members.queries.js";

import type { CreateChatMemberDto } from "../dto/create-chat-member.dto.js";

import type { IChatMembersRepository } from "../interfaces/chat-members.repository.interface.js";

import type { PoolClient } from "pg";

export class ChatMembersRepository
  extends BaseRepository<ChatMemberEntity, ChatMember>
  implements IChatMembersRepository
{
  constructor(
    database: Database,

    mapper: ChatMembersMapper,
  ) {
    super(
      database,

      mapper,
    );
  }

  async add(dto: CreateChatMemberDto): Promise<ChatMember> {
    const entity = await this.queryOne(
      ChatMembersQueries.ADD,

      [dto.chatId, dto.userId, dto.role],
    );

    if (!entity) {
      throw new InternalServerError(
        "Chat member was not created.",

        "CHAT_MEMBER_CREATE_FAILED",
      );
    }

    return this.map(entity);
  }

  async addMany(_members: CreateChatMemberDto[]): Promise<void> {
    throw new Error("Not implemented.");
  }

  async addTx(
    client: PoolClient,

    dto: CreateChatMemberDto,
  ): Promise<ChatMember> {
    return this.saveOneTx(
      client,

      ChatMembersQueries.ADD,

      [dto.chatId, dto.userId, dto.role],
    );
  }

  async findByChat(chatId: string): Promise<ChatMember[]> {
    return this.findMany(
      ChatMembersQueries.FIND_BY_CHAT,

      [chatId],
    );
  }

  async isMember(
    chatId: string,

    userId: string,
  ): Promise<boolean> {
    const entity = await this.queryOne(
      ChatMembersQueries.IS_MEMBER,

      [chatId, userId],
    );

    return entity !== null;
  }
}
