import type { Server } from "socket.io";

import type { AuthenticatedSocket } from "./socket.types.js";

import { ChatHandler, TypingHandler } from "./handlers/index.js";
import { logger } from "../logger/logger.js";

export class SocketGateway {
  constructor(
    private readonly chatHandler: ChatHandler,

    private readonly typingHandler: TypingHandler,
  ) {}

  register(io: Server): void {
    io.on(
      "connection",

      (socket) => {
        const authenticatedSocket = socket as AuthenticatedSocket;

        logger.info(`Socket connected: ${authenticatedSocket.data.user.userId}`);

        this.chatHandler.register(authenticatedSocket);

        this.typingHandler.register(authenticatedSocket);

        authenticatedSocket.on(
          "disconnect",

          () => {
            logger.info(`Socket disconnected: ${authenticatedSocket.data.user.userId}`);
          },
        );
      },
    );
  }
}
