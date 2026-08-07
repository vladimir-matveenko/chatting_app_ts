import type { Server } from "socket.io";

import type { AuthenticatedSocket } from "./socket.types.js";

import type { SocketHandler } from "./interfaces/socket-handler.interface.js";

import { logger } from "../logger/logger.js";
import { PresenceService } from "./services/presence.service.js";
import { SocketEventPublisher } from "./publishers/socket-event.publisher.js";
import { SocketRoomBuilder } from "./socket-room.builder.js";

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

        logger.info(`Socket connected: ${userId}, socket=${socket.id}`);

        socket.join(SocketRoomBuilder.user(userId));

        logger.info(`User ${userId} joined personal room`);

        const firstConnection = this.presenceService.connect(userId);

        if (firstConnection) {
          this.socketPublisher.userOnline(userId);
        }

        for (const handler of this.handlers) {
          handler.register(authenticatedSocket);
        }

        authenticatedSocket.on(
          "disconnect",

          (reason) => {
            logger.info(`Socket disconnected: ${userId}, socket=${socket.id}, reason=${reason}`);

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
