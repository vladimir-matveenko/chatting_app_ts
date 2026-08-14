import type { CreateChatDto } from "../dto/create-chat.dto.js";

import { IChatMembersRepository } from "../interfaces/chat-members.repository.interface.js";

import type { IChatsRepository } from "../interfaces/chats.repository.interface.js";

import { ChatFingerprintService } from "./chat-fingerprint.service.js";

import { ChatMemberRole } from "../enums/chat-member-role.enum.js";
import { Database } from "../../../core/database/database.js";
import { PoolClient } from "pg";
import { ChatType } from "../enums/chat-type.enum.js";
import { NotFoundError, ValidationError } from "../../../core/errors/index.js";
import type { IUsersRepository } from "../../users/interfaces/users.repository.interface.js";
import { Chat } from "../models/chat.model.js";
import type { IChatListRepository } from "../interfaces/chat-list.repository.interface.js";
import { ChatListItem } from "../models/chat-list-item.model.js";
import { ChatMember } from "../models/chat-member.model.js";
import { isUniqueViolation } from "../../../core/database/is-unique-violation.js";
import { ArchiveChatDto } from "../dto/archive-chat.dto.js";
import { MuteChatDto } from "../dto/mute-chat.dto.js";
import { AddChatMembersDto } from "../dto/add-chat-members.dto.js";
import { ChangeMemberRoleDto } from "../dto/request/change-member-role.dto.js";
import { TransferOwnershipDto } from "../dto/transfer-ownership.dto.js";
import { UpdateChatDto } from "../dto/update-chat.dto.js";

import { PresenceService } from "../../../core/websocket/services/presence.service.js";
import { ChatPermissionsService } from "./chat-permissions.service.js";
import { FindUsersDto } from "../../users/dto/find-users.dto.js";
import { ChatNotificationsService } from "./chat-notifications.service.js";

const PREVIOUS_OWNER_ROLE = ChatMemberRole.ADMIN;

export class ChatsService {
  constructor(
    private readonly database: Database,

    private readonly usersRepository: IUsersRepository,

    private readonly chatsRepository: IChatsRepository,

    private readonly chatListRepository: IChatListRepository,

    private readonly chatMembersRepository: IChatMembersRepository,

    private readonly fingerprintService: ChatFingerprintService,

    private readonly presenceService: PresenceService,

    private readonly chatPermissionsService: ChatPermissionsService,

    private readonly chatNotificationsService: ChatNotificationsService,
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
    chatId: string,

    userId: string,
  ): Promise<Chat> {
    await this.chatPermissionsService.ensureMember(chatId, userId);

    const chat = await this.chatsRepository.findById(chatId, userId);

    if (!chat) {
      throw new NotFoundError("Chat not found.");
    }

    return chat;
  }

  async findByUser(userId: string, dto: FindUsersDto): Promise<ChatListItem[]> {
    return this.chatListRepository.findByUser(userId, dto);
  }

  async findArchivedByUser(userId: string, dto: FindUsersDto): Promise<ChatListItem[]> {
    return this.chatListRepository.findArchivedByUser(userId, dto);
  }

  async findMembers(
    chatId: string,

    userId: string,

    dto: FindUsersDto,
  ): Promise<ChatMember[]> {
    await this.chatPermissionsService.ensureMember(
      chatId,

      userId,
    );

    const members = await this.chatMembersRepository.findByChat(chatId, dto);

    return members.map((member) => ({
      ...member,

      isOnline: this.presenceService.isOnline(member.userId),
    }));
  }

  async findMemberById(
    chatId: string,

    userId: string,
  ): Promise<ChatMember | null> {
    await this.chatPermissionsService.ensureMember(
      chatId,

      userId,
    );

    return await this.chatMembersRepository.findByChatAndUser(chatId, userId);
  }

  async archive(
    chatId: string,

    userId: string,

    dto: ArchiveChatDto,
  ): Promise<void> {
    await this.chatPermissionsService.ensureMember(
      chatId,

      userId,
    );

    await this.chatsRepository.archive(
      chatId,

      userId,

      dto.isArchived,
    );
  }

  async mute(
    chatId: string,

    userId: string,

    dto: MuteChatDto,
  ): Promise<void> {
    await this.chatPermissionsService.ensureMember(
      chatId,

      userId,
    );

    await this.chatMembersRepository.mute(
      chatId,

      userId,

      dto.isMuted,
    );
  }

  async leave(
    chatId: string,

    userId: string,
  ): Promise<void> {
    await this.chatPermissionsService.ensureMember(
      chatId,

      userId,
    );

    const chat = await this.chatsRepository.findById(chatId, userId);

    if (!chat) {
      throw new NotFoundError("Chat not found.");
    }

    if (chat.type === ChatType.PRIVATE) {
      throw new ValidationError("Cannot leave private chat.");
    }

    await this.chatMembersRepository.leave(
      chatId,

      userId,
    );
  }

  async addMembers(
    chatId: string,

    actorId: string,

    dto: AddChatMembersDto,
  ): Promise<void> {
    // any participant can add a new member
    await this.chatPermissionsService.ensureMember(
      chatId,

      actorId,
    );

    const chat = await this.chatsRepository.findById(chatId, actorId);

    if (!chat) {
      throw new NotFoundError("Chat not found.");
    }

    if (chat.type !== ChatType.GROUP) {
      throw new ValidationError("Members can only be added to group chats.");
    }

    const users = await this.usersRepository.findByIds(dto.memberIds);

    if (users.length !== dto.memberIds.length) {
      throw new ValidationError("One or more users do not exist.");
    }

    await this.chatMembersRepository.addMembers(
      chatId,

      dto.memberIds,
    );

    await this.chatNotificationsService.notifyInvited(chatId, actorId, dto);
    await this.chatNotificationsService.notifyMembersAdded(chatId, actorId, dto);
  }

  async removeMember(
    chatId: string,

    actorId: string,

    memberId: string,
  ): Promise<void> {
    await this.chatPermissionsService.ensureCanManageMembers(
      chatId,

      actorId,

      memberId,
    );

    await this.chatMembersRepository.removeMember(
      chatId,

      memberId,
    );

    await this.chatNotificationsService.notifyMemberRemoved(chatId, actorId, memberId);
  }

  async changeMemberRole(
    chatId: string,

    actorId: string,

    memberId: string,

    dto: ChangeMemberRoleDto,
  ): Promise<void> {
    await this.chatPermissionsService.ensureCanManageMembers(
      chatId,

      actorId,

      memberId,
    );

    await this.chatMembersRepository.updateRole(
      chatId,

      memberId,

      dto.role,
    );

    await this.chatNotificationsService.notifyMemberRoleChanged(
      chatId,
      actorId,
      memberId,
      dto.role,
    );
  }

  async transferOwnership(
    chatId: string,

    actorId: string,

    dto: TransferOwnershipDto,
  ): Promise<void> {
    if (dto.userId === actorId) {
      throw new ValidationError("You are already the owner.");
    }

    const chat = await this.chatsRepository.findById(chatId, actorId);

    if (!chat) {
      throw new NotFoundError("Chat not found.");
    }

    if (chat.type !== ChatType.GROUP) {
      throw new ValidationError("Ownership can only be transferred in group chats.");
    }

    await this.chatPermissionsService.ensureCanTransferOwnership(chatId, actorId, dto.userId);

    await this.database.transaction(async (client: PoolClient) => {
      await this.chatMembersRepository.updateRoleTx(
        client,

        chatId,

        actorId,

        PREVIOUS_OWNER_ROLE,
      );

      await this.chatMembersRepository.updateRoleTx(
        client,

        chatId,

        dto.userId,

        ChatMemberRole.OWNER,
      );

      await this.chatsRepository.updateOwnerTx(
        client,

        chatId,

        dto.userId,
      );
    });

    await this.chatNotificationsService.notifyOwnershipTransferred(chatId, actorId, dto.userId);
  }

  async update(
    chatId: string,

    userId: string,

    dto: UpdateChatDto,
  ): Promise<Chat> {
    await this.chatPermissionsService.ensureCanEditChat(chatId, userId);

    const chat = await this.chatsRepository.update(chatId, dto);

    await this.chatNotificationsService.notifyChatUpdated(chatId, userId);

    return chat;
  }
}
