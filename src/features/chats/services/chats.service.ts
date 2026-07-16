import type { CreateChatDto } from "../dto/create-chat.dto.js";

import { IChatMembersRepository } from "../interfaces/chat-members.repository.interface.js";

import type { IChatsRepository } from "../interfaces/chats.repository.interface.js";

import { ChatFingerprintService } from "./chat-fingerprint.service.js";

import { ChatMemberRole } from "../enums/chat-member-role.enum.js";
import { Database } from "../../../core/database/database.js";
import { PoolClient } from "pg";
import { ChatType } from "../enums/chat-type.enum.js";
import { ForbiddenError, NotFoundError, ValidationError } from "../../../core/errors/index.js";
import type { IUsersRepository } from "../../users/interfaces/users.repository.interface.js";
import { Chat } from "../models/chat.model.js";
import type { IChatListRepository } from "../interfaces/chat-list.repository.interface.js";
import { ChatListItem } from "../models/chat-list-item.model.js";
import { ChatMember } from "../models/chat-member.model.js";
import { isUniqueViolation } from "../../../core/database/is-unique-violation.js";

export class ChatsService {
  constructor(
    private readonly database: Database,

    private readonly usersRepository: IUsersRepository,

    private readonly chatsRepository: IChatsRepository,

    private readonly chatListRepository: IChatListRepository,

    private readonly chatMembersRepository: IChatMembersRepository,

    private readonly fingerprintService: ChatFingerprintService,
  ) {}

  async create(dto: CreateChatDto): Promise<Chat> {
    const memberIds = this.normalizeMembers(
      dto.memberIds,

      dto.ownerId,
    );

    await this.validateMembers(
      dto,

      memberIds,
    );

    const normalizedDto: CreateChatDto = {
      ...dto,

      memberIds,

      fingerprint: this.fingerprintService.build({
        ...dto,

        memberIds,
      }),
    };

    return this.database.transaction(async (client: PoolClient) => {
      const existing = await this.chatsRepository.findByFingerprintTx(
        client,

        normalizedDto.fingerprint,
      );

      if (existing) {
        return existing;
      }

      try {
        const chat = await this.chatsRepository.createTx(
          client,

          normalizedDto,
        );

        await this.createChatMembers(
          client,

          chat.id,

          normalizedDto,
        );

        return chat;
      } catch (error) {
        if (isUniqueViolation(error)) {
          const existing = await this.chatsRepository.findByFingerprintTx(
            client,

            normalizedDto.fingerprint,
          );

          if (existing) {
            return existing;
          }
        }

        throw error;
      }
    });
  }

  private normalizeMembers(
    memberIds: string[],

    ownerId: string,
  ): string[] {
    const normalized = [...new Set(memberIds)];

    if (!normalized.includes(ownerId)) {
      normalized.push(ownerId);
    }

    return normalized;
  }

  private async validateMembers(
    dto: CreateChatDto,

    memberIds: string[],
  ): Promise<void> {
    this.validateChatType(dto.type, memberIds);

    const users = await this.usersRepository.findByIds(memberIds);

    if (users.length !== memberIds.length) {
      throw new ValidationError("One or more users do not exist.");
    }
  }

  private validateChatType(
    type: ChatType,

    memberIds: string[],
  ): void {
    if (type === ChatType.PRIVATE && memberIds.length !== 2) {
      throw new ValidationError("Private chat must contain exactly two members.");
    }

    if (type === ChatType.GROUP && memberIds.length < 2) {
      throw new ValidationError("Group chat must contain at least two members.");
    }
  }

  private async createChatMembers(
    client: PoolClient,

    chatId: string,

    dto: CreateChatDto,
  ): Promise<void> {
    for (const memberId of dto.memberIds) {
      await this.chatMembersRepository.addTx(
        client,

        {
          chatId,

          userId: memberId,

          role: memberId === dto.ownerId ? ChatMemberRole.OWNER : ChatMemberRole.MEMBER,
        },
      );
    }
  }

  async findById(
    id: string,

    userId: string,
  ): Promise<Chat> {
    const member = await this.chatMembersRepository.findByChatAndUser(
      id,

      userId,
    );

    if (!member) {
      throw new NotFoundError("Chat not found.");
    }

    const chat = await this.chatsRepository.findById(id);

    if (!chat) {
      throw new NotFoundError("Chat not found.");
    }

    return chat;
  }

  async findByUser(userId: string): Promise<ChatListItem[]> {
    return this.chatListRepository.findByUser(userId);
  }

  async findMembers(
    chatId: string,

    userId: string,
  ): Promise<ChatMember[]> {
    await this.ensureMember(
      chatId,

      userId,
    );

    return this.chatMembersRepository.findByChat(chatId);
  }

  private async ensureMember(
    chatId: string,

    userId: string,
  ): Promise<void> {
    const isMember = await this.chatMembersRepository.isMember(
      chatId,

      userId,
    );

    if (!isMember) {
      throw new ForbiddenError(
        "You are not a member of this chat.",

        "CHAT_ACCESS_DENIED",
      );
    }
  }
}
