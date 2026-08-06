import type { Server } from "socket.io";
import { SocketRoomBuilder } from "../socket-room.builder.js";
import { SocketEvents } from "../socket.events.js";
import { Message } from "../../../features/messages/models/message.model.js";
import {
  ChatChangedEventDto,
  MessageReadEventDto,
  PresenceEventDto,
  TypingEventDto,
} from "../dto/index.js";
import { logger } from "../../logger/logger.js";

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

  messageRead(
    chatId: string,

    messageId: string,

    userId: string,
  ): void {
    const dto: MessageReadEventDto = {
      chatId,

      messageId,

      userId,
    };

    this.emitToChat(
      chatId,

      SocketEvents.MessageRead,

      dto,
    );
  }

  userOnline(userId: string): void {
    const dto: PresenceEventDto = {
      userId,
    };

    this.io?.emit(
      SocketEvents.UserOnline,

      dto,
    );
  }

  userOffline(userId: string): void {
    const dto: PresenceEventDto = {
      userId,
    };

    this.io?.emit(
      SocketEvents.UserOffline,

      dto,
    );
  }

  reactionUpdated(message: Message): void {
    logger.info(
      "Publishing reaction.updated",

      message.chatId,
    );

    this.emitToChat(
      message.chatId,

      SocketEvents.ReactionUpdated,

      message,
    );
  }

  chatChanged(chatId: string): void {
    const dto: ChatChangedEventDto = {
      chatId,
    };

    this.emitToChat(chatId, SocketEvents.ChatChanged, dto);

    logger.info(
      `Chat ${chatId} updated`,

      chatId,
    );
  }
}
