import type { Server } from "socket.io";

import type { AuthenticatedSocket } from "./socket.types.js";

import type { SocketHandler } from "./interfaces/socket-handler.interface.js";

import { logger } from "../logger/logger.js";

export class SocketGateway {
  constructor(private readonly handlers: SocketHandler[]) {}

  register(io: Server): void {
    io.on(
      "connection",

      (socket) => {
        const authenticatedSocket = socket as AuthenticatedSocket;

        logger.info(`Socket connected: ${authenticatedSocket.data.user.userId}`);

        this.handlers.forEach((handler) => handler.register(authenticatedSocket));

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
