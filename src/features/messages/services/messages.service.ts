import type { PoolClient } from "pg";

import { Database } from "../../../core/database/database.js";

import { ForbiddenError, NotFoundError, ValidationError } from "../../../core/errors/index.js";

import type { CreateMessageDto } from "../dto/create-message.dto.js";

import type { IMessagesRepository } from "../interfaces/messages.repository.interface.js";

import type { IChatsRepository } from "../../chats/interfaces/chats.repository.interface.js";

import type { IChatMembersRepository } from "../../chats/interfaces/chat-members.repository.interface.js";

import type { Message } from "../models/message.model.js";

import { UpdateMessageRequestDto } from "../dto/request/update-message.request.dto.js";
import { ChatMemberRole } from "../../chats/enums/chat-member-role.enum.js";

import { GetMessagesRequestDto } from "../dto/request/get-messages.request.dto.js";
import { MessagesMode } from "../enums/message-mode.enum.js";
import { MessagesPage } from "../models/messages-page.model.js";
import { MessageSearchResult } from "../models/message-search.model.js";
import { IMessageSearchRepository } from "../interfaces/message-search.repository.interface.js";
import { MessagesNotificationsService } from "./messages-notifications.service.js";

export class MessagesService {
  constructor(
    private readonly database: Database,

    private readonly messagesRepository: IMessagesRepository,

    private readonly messagesSearchRepository: IMessageSearchRepository,

    private readonly chatsRepository: IChatsRepository,

    private readonly chatMembersRepository: IChatMembersRepository,

    private readonly messagesNotificationsService: MessagesNotificationsService,
  ) {}

  async create(dto: CreateMessageDto): Promise<Message> {
    await this.ensureChatExists(dto.chatId, dto.senderId);

    await this.ensureMember(
      dto.chatId,

      dto.senderId,
    );

    const repliedMessage = await this.ensureReplyExists(dto);

    const message = await this.database.transaction(async (client: PoolClient) => {
      const message = await this.messagesRepository.createTx(client, dto);

      await this.chatsRepository.updateActivityTx(client, dto.chatId);

      return message;
    });

    await this.messagesNotificationsService.notifyMessagesCreated(message, repliedMessage);

    return message;
  }

  async findById(
    id: string,

    userId: string,
  ): Promise<Message | null> {
    const message = await this.messagesRepository.findById(id);

    if (!message) {
      return null;
    }

    await this.ensureMember(
      message.chatId,

      userId,
    );

    return message;
  }

  async getMessages(
    chatId: string,
    currentUserId: string,
    dto: GetMessagesRequestDto,
  ): Promise<MessagesPage> {
    const member = await this.chatMembersRepository.findByChatAndUser(chatId, currentUserId);

    if (!member) {
      throw new ValidationError("User is not a member of this chat.");
    }

    switch (dto.mode) {
      case MessagesMode.LATEST:
        return this.loadLatestMessages(chatId, currentUserId, dto.limit);

      case MessagesMode.BEFORE:
        return this.loadMessagesBefore(chatId, currentUserId, dto.anchorMessageId!, dto.limit);

      case MessagesMode.AFTER:
        return this.loadMessagesAfter(chatId, currentUserId, dto.anchorMessageId!, dto.limit);

      case MessagesMode.AROUND:
        return this.loadAroundMessages(
          chatId,
          currentUserId,
          dto.anchorMessageId!,
          dto.before!,
          dto.after!,
        );
    }
  }

  private async loadLatestMessages(
    chatId: string,
    currentUserId: string,
    limit: number,
  ): Promise<MessagesPage> {
    const messages = await this.messagesRepository.findLatest(chatId, currentUserId, limit);

    const hasMore =
      messages.length > 0 &&
      (await this.messagesRepository.hasMessagesBefore(chatId, messages.at(-1)!.id));

    return {
      messages,
      hasPrevious: hasMore,
      hasNext: false,
    };
  }

  private async loadMessagesBefore(
    chatId: string,
    currentUserId: string,
    beforeMessageId: string,
    limit: number,
  ): Promise<MessagesPage> {
    const messages = await this.messagesRepository.findBefore(
      chatId,
      currentUserId,
      beforeMessageId,
      limit,
    );

    const hasPrevious =
      messages.length > 0 &&
      (await this.messagesRepository.hasMessagesBefore(chatId, messages.at(-1)!.id));

    return {
      messages,
      hasPrevious,
      hasNext: true,
    };
  }

  private async loadMessagesAfter(
    chatId: string,
    currentUserId: string,
    afterMessageId: string,
    limit: number,
  ): Promise<MessagesPage> {
    const messages = await this.messagesRepository.findAfter(
      chatId,
      currentUserId,
      afterMessageId,
      limit,
    );

    if (messages.length === 0) {
      return {
        messages,
        hasPrevious: true,
        hasNext: false,
      };
    }

    const hasNext = await this.messagesRepository.hasMessagesAfter(chatId, messages[0]!.id);

    return {
      messages,
      hasPrevious: true,
      hasNext,
    };
  }

  private async loadAroundMessages(
    chatId: string,
    currentUserId: string,
    messageId: string,
    before: number,
    after: number,
  ): Promise<MessagesPage> {
    const target = await this.messagesRepository.findById(messageId);

    if (!target) {
      throw new NotFoundError("Message not found.");
    }

    if (target.chatId !== chatId) {
      throw new ValidationError("Message does not belong to this chat.");
    }

    const messages = await this.messagesRepository.findAroundMessage(
      chatId,
      messageId,
      currentUserId,
      before,
      after,
    );

    if (messages.length === 0) {
      return {
        messages: [],
        hasPrevious: false,
        hasNext: false,
      };
    }

    const newest = messages[0]!;
    const oldest = messages.at(-1)!;

    const [hasPrevious, hasNext] = await Promise.all([
      this.messagesRepository.hasMessagesBefore(chatId, oldest.id),
      this.messagesRepository.hasMessagesAfter(chatId, newest.id),
    ]);

    return {
      messages,
      hasPrevious,
      hasNext,
    };
  }

  private async ensureChatExists(chatId: string, userId: string): Promise<void> {
    const chat = await this.chatsRepository.findById(chatId, userId);

    if (!chat) {
      throw new NotFoundError(
        "Chat not found.",

        "CHAT_NOT_FOUND",
      );
    }
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

  private async ensureReplyExists(dto: CreateMessageDto): Promise<Message | null> {
    if (!dto.replyToId) {
      return null;
    }

    const reply = await this.messagesRepository.findById(dto.replyToId);

    if (!reply) {
      throw new NotFoundError("Reply message not found.", "MESSAGE_NOT_FOUND");
    }

    if (reply.chatId !== dto.chatId) {
      throw new ForbiddenError("Reply message belongs to another chat.", "INVALID_REPLY");
    }

    return reply;
  }

  async update(
    messageId: string,

    userId: string,

    dto: UpdateMessageRequestDto,
  ): Promise<Message> {
    const message = await this.messagesRepository.getByIdOrThrow(messageId);

    if (message.sender.id !== userId) {
      throw new ForbiddenError(
        "Only the author can edit the message.",

        "MESSAGE_EDIT_FORBIDDEN",
      );
    }

    if (message.isDeleted) {
      throw new ValidationError("Deleted message cannot be edited.");
    }

    return this.messagesRepository.update(
      messageId,

      dto.body,
    );
  }

  async delete(
    id: string,

    userId: string,
  ): Promise<Message> {
    const message = await this.messagesRepository.getByIdOrThrow(id);

    if (message.sender.id !== userId) {
      throw new ForbiddenError(
        "You can delete only your own messages.",

        "MESSAGE_DELETE_DENIED",
      );
    }

    if (message.isDeleted) {
      return message;
    }

    return this.messagesRepository.delete(id);
  }

  async pinMessage(
    messageId: string,

    userId: string,
  ): Promise<Message> {
    const message = await this.messagesRepository.getByIdOrThrow(messageId);

    await this.ensureAdmin(
      message.chatId,

      userId,
    );

    return await this.messagesRepository.pin(messageId);
  }

  async unpinMessage(
    messageId: string,

    userId: string,
  ): Promise<Message> {
    const message = await this.messagesRepository.getByIdOrThrow(messageId);

    await this.ensureAdmin(
      message.chatId,

      userId,
    );

    return await this.messagesRepository.unpin(messageId);
  }

  private async ensureAdmin(
    chatId: string,

    userId: string,
  ): Promise<void> {
    const member = await this.chatMembersRepository.findByChatAndUser(
      chatId,

      userId,
    );

    if (!member) {
      throw new NotFoundError("Chat not found.");
    }

    if (member.role !== ChatMemberRole.OWNER && member.role !== ChatMemberRole.ADMIN) {
      throw new ForbiddenError(
        "Insufficient permissions.",

        "INSUFFICIENT_PERMISSIONS",
      );
    }
  }

  async findPinnedMessages(
    chatId: string,

    userId: string,
  ): Promise<Message[]> {
    await this.ensureMember(
      chatId,

      userId,
    );

    return this.messagesRepository.findPinned(chatId, userId);
  }

  async search(
    chatId: string,
    currentUserId: string,
    query: string,
    limit = 30,
  ): Promise<MessageSearchResult[]> {
    const member = await this.chatMembersRepository.findByChatAndUser(chatId, currentUserId);

    if (!member) {
      throw new ValidationError("User is not a member of this chat.");
    }

    return this.messagesSearchRepository.search(chatId, query, limit);
  }
}
