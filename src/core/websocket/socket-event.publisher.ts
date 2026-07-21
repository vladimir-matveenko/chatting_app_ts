import type { Server } from "socket.io";

import { SocketRoomBuilder } from "./socket-room.builder.js";
import { SocketEvents } from "./socket.events.js";

import type { Message } from "../../features/messages/models/message.model.js";
import { logger } from "../logger/logger.js";
import { TypingEventDto } from "./dto/typing-event.dto.js";

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

  // feature events

  messageCreated(message: Message): void {
    logger.info(
      "Publishing message.created",

      message.chatId,
    );
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

  typingStarted(
    chatId: string,

    userId: string,
  ): void {
    const dto: TypingEventDto = {
      chatId,

      userId,
    };

    this.emitToChat(
      chatId,

      SocketEvents.TypingStarted,

      dto,
    );
  }

  typingStopped(
    chatId: string,

    userId: string,
  ): void {
    const dto: TypingEventDto = {
      chatId,

      userId,
    };

    this.emitToChat(
      chatId,

      SocketEvents.TypingStopped,

      dto,
    );
  }
}
