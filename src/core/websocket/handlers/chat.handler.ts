import type { AuthenticatedSocket } from "../socket.types.js";

import { SocketEvents } from "../socket.events.js";

import type { ChatRoomService } from "../chat-room.service.js";
import { logger } from "../../logger/logger.js";
import { SocketHandler } from "../interfaces/socket-handler.interface.js";

export class ChatHandler implements SocketHandler {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  register(socket: AuthenticatedSocket): void {
    socket.on(
      SocketEvents.JoinChat,

      async (chatId: string) => {
        try {
          await this.chatRoomService.join(
            socket,

            chatId,
          );

          logger.info(`${socket.data.user.userId} joined ${chatId}`);
        } catch (error) {
          socket.emit(
            SocketEvents.Exception,

            {
              message: error instanceof Error ? error.message : "Unknown error",
            },
          );
        }
      },
    );

    socket.on(
      SocketEvents.LeaveChat,

      async (chatId: string) => {
        try {
          await this.chatRoomService.leave(
            socket,

            chatId,
          );
        } catch (error) {
          socket.emit(
            SocketEvents.Exception,

            {
              message: error instanceof Error ? error.message : "Unknown error",
            },
          );
        }
      },
    );
  }
}
