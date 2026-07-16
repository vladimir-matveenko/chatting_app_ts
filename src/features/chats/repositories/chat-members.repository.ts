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
import { ChatMemberRole } from "../enums/chat-member-role.enum.js";

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

  async findByChatAndUser(
    chatId: string,

    userId: string,
  ): Promise<ChatMember | null> {
    return this.findOne(
      ChatMembersQueries.FIND_BY_CHAT_AND_USER,

      [chatId, userId],
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

  async mute(
    chatId: string,

    userId: string,

    isMuted: boolean,
  ): Promise<void> {
    await this.query(
      ChatMembersQueries.MUTE_CHAT,

      [chatId, userId, isMuted],
    );
  }

  async leave(
    chatId: string,

    userId: string,
  ): Promise<void> {
    await this.query(
      ChatMembersQueries.LEAVE_CHAT,

      [chatId, userId],
    );
  }

  async addMembers(
    chatId: string,

    memberIds: string[],
  ): Promise<void> {
    await this.query(
      ChatMembersQueries.ADD_MEMBERS,

      [chatId, memberIds],
    );
  }

  async removeMember(
    chatId: string,

    userId: string,
  ): Promise<void> {
    await this.query(
      ChatMembersQueries.REMOVE_MEMBER,

      [chatId, userId],
    );
  }

  async updateRole(
    chatId: string,

    userId: string,

    role: ChatMemberRole,
  ): Promise<void> {
    await this.query(
      ChatMembersQueries.UPDATE_ROLE,

      [chatId, userId, role],
    );
  }
}
