import type { CreateChatMemberDto } from "../dto/create-chat-member.dto.js";
import type { PoolClient } from "pg";
import { ChatMember } from "../models/chat-member.model.js";
import { AddChatMembersDto } from "../dto/add-chat-members.dto.js";
import { ChatMemberRole } from "../enums/chat-member-role.enum.js";

export interface IChatMembersRepository {
  add(dto: CreateChatMemberDto): Promise<ChatMember>;

  addTx(
    client: PoolClient,

    dto: CreateChatMemberDto,
  ): Promise<ChatMember>;

  findByChat(chatId: string): Promise<ChatMember[]>;

  isMember(
    chatId: string,

    userId: string,
  ): Promise<boolean>;

  findByChatAndUser(
    chatId: string,

    userId: string,
  ): Promise<ChatMember | null>;

  mute(
    chatId: string,

    userId: string,

    isMuted: boolean,
  ): Promise<void>;

  leave(
    chatId: string,

    userId: string,
  ): Promise<void>;

  addMembers(
    chatId: string,

    memberIds: string[],
  ): Promise<void>;

  removeMember(
    chatId: string,

    userId: string,
  ): Promise<void>;

  updateRole(
    chatId: string,

    userId: string,

    role: ChatMemberRole,
  ): Promise<void>;
}
