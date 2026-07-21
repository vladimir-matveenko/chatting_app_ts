import type { AuthenticatedSocket } from "../socket.types.js";

export interface SocketHandler {
  register(socket: AuthenticatedSocket): void;
}
