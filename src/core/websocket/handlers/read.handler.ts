import type { AuthenticatedSocket } from "../socket.types.js";

import { SocketEvents } from "../socket.events.js";

import type { MessageReadService } from "../../../features/messages/services/message-read.service.js";
import type { SocketEventPublisher } from "../socket-event.publisher.js";
import { logger } from "../../logger/logger.js";

export class ReadHandler {
  constructor(
    private readonly messageReadService: MessageReadService,

    private readonly socketPublisher: SocketEventPublisher,
  ) {}

  register(socket: AuthenticatedSocket): void {
    socket.on(
      SocketEvents.MessageRead,

      async (payload: { chatId: string; messageId: string }) => {
        try {
          const message = await this.messageReadService.markRead(
            payload.chatId,

            payload.messageId,

            socket.data.user.userId,
          );

          this.socketPublisher.messageRead(
            message.chatId,

            message.id,

            socket.data.user.userId,
          );

          logger.info(
            `User ${socket.data.user.userId} read message ${message.id} in chat ${message.chatId}`,
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
