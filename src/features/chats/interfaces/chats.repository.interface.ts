import type { CreateChatDto } from "../dto/create-chat.dto.js";

import type { PoolClient } from "pg";

import { Chat } from "../models/chat.model.js";
import { UpdateChatDto } from "../dto/update-chat.dto.js";

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

  archive(
    chatId: string,

    userId: string,

    isArchived: boolean,
  ): Promise<void>;

  updateOwnerTx(
    client: PoolClient,

    chatId: string,

    ownerId: string,
  ): Promise<void>;

  update(
    id: string,

    dto: UpdateChatDto,
  ): Promise<Chat>;
}
