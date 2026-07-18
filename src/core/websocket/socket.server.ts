import { Server as HttpServer } from "node:http";

import { Server } from "socket.io";
import { SocketAuthMiddleware } from "./socket-auth.middleware.js";

export class SocketServer {
  readonly io: Server;

  constructor(server: HttpServer, authMiddleware: SocketAuthMiddleware) {
    this.io = new Server(server, {
      cors: {
        origin: "*",

        methods: ["GET", "POST"],
      },
    });
    this.io.use(authMiddleware.handler);
  }

  initialize(): void {
    this.io.on(
      "connection",

      (socket) => {
        console.log(`Socket connected: ${socket.data.user.userId}`);

        socket.on(
          "disconnect",

          () => {
            console.log(`Socket disconnected: ${socket.data.user.userId}`);
          },
        );
      },
    );
  }
}
