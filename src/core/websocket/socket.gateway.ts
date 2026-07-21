import type { Server } from "socket.io";

import type { AuthenticatedSocket } from "./socket.types.js";

import type { SocketHandler } from "./interfaces/socket-handler.interface.js";

import { logger } from "../logger/logger.js";
import { PresenceService } from "./presence.service.js";
import { SocketEventPublisher } from "./socket-event.publisher.js";

export class SocketGateway {
  constructor(
    private readonly presenceService: PresenceService,
    private readonly socketPublisher: SocketEventPublisher,
    private readonly handlers: SocketHandler[],
  ) {}

  register(io: Server): void {
    this.socketPublisher.attach(io);
    io.on(
      "connection",

      (socket) => {
        const authenticatedSocket = socket as AuthenticatedSocket;

        const userId = authenticatedSocket.data.user.userId;

        logger.info(`Socket connected: ${userId}`);

        const firstConnection = this.presenceService.connect(userId);

        if (firstConnection) {
          this.socketPublisher.userOnline(userId);
        }

        for (const handler of this.handlers) {
          handler.register(authenticatedSocket);
        }

        authenticatedSocket.on(
          "disconnect",

          () => {
            logger.info(`Socket disconnected: ${userId}`);

            const lastConnection = this.presenceService.disconnect(userId);

            if (lastConnection) {
              this.socketPublisher.userOffline(userId);
            }
          },
        );
      },
    );
  }
}
