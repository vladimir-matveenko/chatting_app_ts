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

  findByChat(
    chatId: string,

    userId: string,

    limit: number,

    before?: Date,
  ): Promise<Message[]>;

  update(
    id: string,

    body: string,
  ): Promise<Message>;

  delete(id: string): Promise<Message>;
}
