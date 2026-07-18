import type { Server } from "socket.io";

import type { AuthenticatedSocket } from "./socket.types.js";
import { SocketEventPublisher } from "./socket-event.publisher.js";

import { SocketRoomBuilder } from "./socket-room.builder.js";
import { SocketEvents } from "./socket.events.js";
import { ChatRoomService } from "./chat-room.service.js";

export class SocketGateway {
  constructor(
    private readonly publisher: SocketEventPublisher,

    private readonly roomService: ChatRoomService,
  ) {}

  register(io: Server): void {
    this.publisher.attach(io);

    io.on(
      "connection",

      (socket) => {
        this.onConnection(socket as AuthenticatedSocket);
      },
    );
  }

  private onConnection(socket: AuthenticatedSocket): void {
    socket.join(SocketRoomBuilder.user(socket.data.user.userId));

    console.log(`Socket connected: ${socket.data.user.userId}`);

    socket.on(
      SocketEvents.JoinChat,

      async (chatId: string) => {
        try {
          await this.roomService.join(
            socket,

            chatId,
          );

          console.log(`${socket.data.user.userId} joined ${chatId}`);
        } catch {
          socket.emit(SocketEvents.Exception, {
            code: "CHAT_ACCESS_DENIED",
            message: "You are not a member of this chat.",
          });
        }
      },
    );

    socket.on(
      SocketEvents.LeaveChat,

      async (chatId: string) => {
        await this.roomService.leave(
          socket,

          chatId,
        );
      },
    );

    socket.on(
      "disconnect",

      () => this.onDisconnect(socket),
    );
  }

  private onDisconnect(socket: AuthenticatedSocket): void {
    console.log(`Socket disconnected: ${socket.data.user.userId}`);
  }
}
