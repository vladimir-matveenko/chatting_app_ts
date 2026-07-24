import { ValidationError, NotFoundError } from "../../../core/errors/index.js";

import type { ChatMembersRepository } from "../../chats/repositories/chat-members.repository.js";

import type { MessagesRepository } from "../repositories/messages.repository.js";

import type { ChatReadsRepository } from "../repositories/chat-reads.repository.js";
import { Message } from "../models/message.model.js";

export class MessageReadService {
  constructor(
    private readonly messagesRepository: MessagesRepository,

    private readonly chatMembersRepository: ChatMembersRepository,

    private readonly chatReadsRepository: ChatReadsRepository,
  ) {}

  async markRead(messageId: string, userId: string): Promise<Message> {
    const message = await this.messagesRepository.findById(messageId);

    if (!message) {
      throw new NotFoundError("Message not found.");
    }

    const member = await this.chatMembersRepository.findByChatAndUser(message.chatId, userId);

    if (!member) {
      throw new ValidationError("User is not a member of this chat.");
    }

    await this.chatReadsRepository.markRead(message.chatId, userId, messageId);

    return message;
  }
}
