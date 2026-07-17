import type { PoolClient } from "pg";

import { Database } from "../../../core/database/database.js";

import { ForbiddenError, NotFoundError, ValidationError } from "../../../core/errors/index.js";

import type { CreateMessageDto } from "../dto/create-message.dto.js";

import type { IMessagesRepository } from "../interfaces/messages.repository.interface.js";

import type { IChatsRepository } from "../../chats/interfaces/chats.repository.interface.js";

import type { IChatMembersRepository } from "../../chats/interfaces/chat-members.repository.interface.js";

import type { Message } from "../models/message.model.js";

import { UpdateMessageRequestDto } from "../dto/request/update-message.request.dto.js";

export class MessagesService {
  constructor(
    private readonly database: Database,

    private readonly messagesRepository: IMessagesRepository,

    private readonly chatsRepository: IChatsRepository,

    private readonly chatMembersRepository: IChatMembersRepository,
  ) {}

  async create(dto: CreateMessageDto): Promise<Message> {
    await this.ensureChatExists(dto.chatId);

    await this.ensureMember(
      dto.chatId,

      dto.senderId,
    );

    await this.ensureReplyExists(dto);

    return this.database.transaction(async (client: PoolClient) => {
      const message = await this.messagesRepository.createTx(
        client,

        dto,
      );

      await this.chatsRepository.updateActivityTx(
        client,

        dto.chatId,
      );

      return message;
    });
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

  async findByChat(
    chatId: string,

    userId: string,

    limit = 30,

    before?: Date,
  ): Promise<Message[]> {
    await this.ensureMember(chatId, userId);

    return this.messagesRepository.findByChat(chatId, userId, limit, before);
  }

  private async ensureChatExists(chatId: string): Promise<void> {
    const chat = await this.chatsRepository.findById(chatId);

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

  private async ensureReplyExists(dto: CreateMessageDto): Promise<void> {
    if (!dto.replyToId) {
      return;
    }

    const reply = await this.messagesRepository.findById(dto.replyToId);

    if (!reply) {
      throw new NotFoundError(
        "Reply message not found.",

        "MESSAGE_NOT_FOUND",
      );
    }

    if (reply.chatId !== dto.chatId) {
      throw new ForbiddenError(
        "Reply message belongs to another chat.",

        "INVALID_REPLY",
      );
    }
  }

  async update(
    messageId: string,

    userId: string,

    dto: UpdateMessageRequestDto,
  ): Promise<Message> {
    const message = await this.messagesRepository.findById(messageId);

    if (!message) {
      throw new NotFoundError("Message not found.");
    }

    if (message.senderId !== userId) {
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
    const message = await this.messagesRepository.findById(id);

    if (!message) {
      throw new NotFoundError("Message not found.");
    }

    if (message.senderId !== userId) {
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
}
