import { PoolClient } from "pg";
import type { CreateMessageDto } from "../dto/create-message.dto.js";

import type { Message } from "../models/message.model.js";
import { UpdateMessageDto } from "../dto/update-message.dto.js";

export interface IMessagesRepository {
  create(dto: CreateMessageDto): Promise<Message>;

  createTx(
    client: PoolClient,

    dto: CreateMessageDto,
  ): Promise<Message>;

  findById(id: string): Promise<Message | null>;

  findByChat(
    chatId: string,

    limit: number,

    before?: string,
  ): Promise<Message[]>;

  update(dto: UpdateMessageDto): Promise<Message>;

  delete(id: string): Promise<Message>;
}
