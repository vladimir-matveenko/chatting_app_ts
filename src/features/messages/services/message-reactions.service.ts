import { NotFoundError } from "../../../core/errors/index.js";

import type { AddReactionDto } from "../dto/add-reaction.dto.js";

import type { IMessageReactionsRepository } from "../interfaces/message-reactions.repository.interface.js";

import type { IMessagesRepository } from "../interfaces/messages.repository.interface.js";

import type { IChatMembersRepository } from "../../chats/interfaces/chat-members.repository.interface.js";

import type { MessageReaction } from "../models/message-reaction.model.js";

export class MessageReactionsService {
  constructor(
    private readonly reactionsRepository: IMessageReactionsRepository,

    private readonly messagesRepository: IMessagesRepository,

    private readonly chatMembersRepository: IChatMembersRepository,
  ) {}

  async add(dto: AddReactionDto): Promise<MessageReaction> {
    const message = await this.messagesRepository.findById(dto.messageId);

    if (!message) {
      throw new NotFoundError("Message not found.");
    }

    const member = await this.chatMembersRepository.findByChatAndUser(
      message.chatId,

      dto.userId,
    );

    if (!member) {
      throw new NotFoundError("Chat not found.");
    }

    const existing = await this.reactionsRepository.findByMessageAndUser(
      dto.messageId,

      dto.userId,
    );

    let reaction: MessageReaction;

    if (!existing) {
      reaction = await this.reactionsRepository.add(dto);
    } else if (existing.type === dto.type) {
      return existing;
    } else {
      reaction = await this.reactionsRepository.update(
        existing.id,

        dto.type,
      );
    }

    await this.reactionsRepository.refreshMessageReactions(dto.messageId);

    return reaction;
  }

  async remove(
    messageId: string,

    userId: string,
  ): Promise<void> {
    const reaction = await this.reactionsRepository.findByMessageAndUser(
      messageId,

      userId,
    );

    if (!reaction) {
      return;
    }

    await this.reactionsRepository.delete(reaction.id);

    await this.reactionsRepository.refreshMessageReactions(messageId);
  }
}
