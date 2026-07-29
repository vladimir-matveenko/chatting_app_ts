import { PoolClient } from "pg";
import type { CreateMessageDto } from "../dto/create-message.dto.js";

import type { Message } from "../models/message.model.js";

export interface IMessagesRepository {
  create(dto: CreateMessageDto): Promise<Message>;

  createTx(
    client: PoolClient,

    dto: CreateMessageDto,
  ): Promise<Message>;

  findById(id: string): Promise<Message | null>;

  update(
    id: string,

    body: string,
  ): Promise<Message>;

  delete(id: string): Promise<Message>;

  pin(messageId: string): Promise<Message>;

  unpin(messageId: string): Promise<Message>;

  findPinned(chatId: string, currentUserId: string): Promise<Message[]>;

  getByIdOrThrow(id: string): Promise<Message>;

  // get list of messages
  findLatest(chatId: string, currentUserId: string, limit: number): Promise<Message[]>;

  findBefore(
    chatId: string,
    beforeMessageId: string,
    currentUserId: string,
    limit: number,
  ): Promise<Message[]>;

  findAfter(
    chatId: string,
    afterMessageId: string,
    currentUserId: string,
    limit: number,
  ): Promise<Message[]>;

  findAroundMessage(
    chatId: string,
    messageId: string,
    currentUserId: string,
    before: number,
    after: number,
  ): Promise<Message[]>;

  hasMessagesBefore(chatId: string, messageId: string): Promise<boolean>;

  hasMessagesAfter(chatId: string, messageId: string): Promise<boolean>;
}
