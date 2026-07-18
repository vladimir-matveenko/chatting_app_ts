import type { AuthenticatedSocket } from "./socket.types.js";

import { ForbiddenError } from "../errors/index.js";

import { SocketRoomBuilder } from "./socket-room.builder.js";

import type { IChatMembersRepository } from "../../features/chats/interfaces/chat-members.repository.interface.js";

export class ChatRoomService {
  constructor(private readonly chatMembersRepository: IChatMembersRepository) {}

  async join(
    socket: AuthenticatedSocket,

    chatId: string,
  ): Promise<void> {
    const isMember = await this.chatMembersRepository.isMember(
      chatId,

      socket.data.user.userId,
    );

    if (!isMember) {
      throw new ForbiddenError(
        "You are not a member of this chat.",

        "CHAT_ACCESS_DENIED",
      );
    }

    socket.join(SocketRoomBuilder.chat(chatId));
  }

  async leave(
    socket: AuthenticatedSocket,

    chatId: string,
  ): Promise<void> {
    socket.leave(SocketRoomBuilder.chat(chatId));
  }
}
