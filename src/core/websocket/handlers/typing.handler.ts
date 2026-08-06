import type { AuthenticatedSocket } from "../socket.types.js";

import { SocketEvents } from "../socket.events.js";

import type { ChatRoomService } from "../services/chat-room.service.js";

import { SocketHandler } from "../interfaces/socket-handler.interface.js";
import { logger } from "../../logger/logger.js";
import { SocketEventPublisher } from "../publishers/socket-event.publisher.js";

export class TypingHandler implements SocketHandler {
  constructor(
    private readonly chatRoomService: ChatRoomService,

    private readonly socketPublisher: SocketEventPublisher,
  ) {}

  register(socket: AuthenticatedSocket): void {
    socket.on(
      SocketEvents.TypingStart,

      async (chatId: string) => {
        try {
          await this.chatRoomService.ensureMember(
            socket.data.user.userId,

            chatId,
          );

          this.socketPublisher.typingStarted(
            chatId,

            socket.data.user.userId,
          );

          logger.info(`User ${socket.data.user.userId} started typing in chat ${chatId}`);
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
      SocketEvents.TypingStop,

      async (chatId: string) => {
        try {
          await this.chatRoomService.ensureMember(
            socket.data.user.userId,

            chatId,
          );

          this.socketPublisher.typingStopped(
            chatId,

            socket.data.user.userId,
          );

          logger.info(`User ${socket.data.user.userId} stopped typing in chat ${chatId}`);
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
