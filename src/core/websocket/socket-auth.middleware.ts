import type { Socket } from "socket.io";
import { JwtService } from "../security/index.js";

export class SocketAuthMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  handler = (
    socket: Socket,

    next: (error?: Error) => void,
  ): void => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const payload = this.jwtService.verifyAccessToken(token);

      socket.data.user = {
        userId: payload.userId,
      };

      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  };
}
