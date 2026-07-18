import { Server } from "socket.io";
import { Server as HttpServer } from "node:http";

import type { SocketAuthMiddleware } from "../middleware/socket-auth.middleware.js";

import { SocketGateway } from "./socket.gateway.js";

export class SocketServer {
  readonly io: Server;

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
  }

  register(authMiddleware: SocketAuthMiddleware, gateway: SocketGateway): void {
    this.io.use(authMiddleware.handler);

    gateway.register(this.io);
  }
}
