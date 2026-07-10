import type { CreateChatDto } from "../dto/create-chat.dto.js";

import type { PoolClient } from "pg";

import { Chat } from "../models/chat.model.js";

export interface IChatsRepository {
  create(dto: CreateChatDto): Promise<Chat>;

  createTx(
    client: PoolClient,

    dto: CreateChatDto,
  ): Promise<Chat>;

  findByFingerprint(fingerprint: string): Promise<Chat | null>;

  findByFingerprintTx(
    client: PoolClient,

    fingerprint: string,
  ): Promise<Chat | null>;

  findById(id: string): Promise<Chat | null>;

  updateActivityTx(
    client: PoolClient,

    chatId: string,
  ): Promise<void>;
}
