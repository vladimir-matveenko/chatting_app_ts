import type { Server } from "socket.io";

import { SocketRoomBuilder } from "./socket-room.builder.js";
import { SocketEvents } from "./socket.events.js";

import type { Message } from "../../features/messages/models/message.model.js";

export class SocketEventPublisher {
  private io?: Server;

  attach(io: Server): void {
    this.io = io;
  }

  emitToChat(
    chatId: string,

    event: string,

    payload: unknown,
  ): void {
    this.io?.to(SocketRoomBuilder.chat(chatId)).emit(
      event,

      payload,
    );
  }

  emitToUser(
    userId: string,

    event: string,

    payload: unknown,
  ): void {
    this.io?.to(SocketRoomBuilder.user(userId)).emit(
      event,

      payload,
    );
  }

  messageCreated(message: Message): void {
    this.emitToChat(
      message.chatId,

      SocketEvents.MessageCreated,

      message,
    );
  }

  messageUpdated(message: Message): void {
    this.emitToChat(
      message.chatId,

      SocketEvents.MessageUpdated,

      message,
    );
  }

  messageDeleted(message: Message): void {
    this.emitToChat(
      message.chatId,

      SocketEvents.MessageDeleted,

      message,
    );
  }

  messagePinned(message: Message): void {
    this.emitToChat(
      message.chatId,

      SocketEvents.MessagePinned,

      message,
    );
  }

  messageUnpinned(message: Message): void {
    this.emitToChat(
      message.chatId,

      SocketEvents.MessageUnpinned,

      message,
    );
  }
}
