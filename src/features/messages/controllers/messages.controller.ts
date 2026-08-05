import type { Request, Response } from "express";

import { UnauthorizedError, ValidationError } from "../../../core/errors/index.js";

import type { MessagesService } from "../services/messages.service.js";

import { CreateMessageRequestMapper } from "../mappers/create-message-request.mapper.js";

import { requireId } from "../../../core/http/validators/index.js";
import { SocketEventPublisher } from "../../../core/websocket/socket-event.publisher.js";
import { MessageReadService } from "../services/message-read.service.js";

import { MessagesRequestValidators } from "../validators/messages-request.validators.js";

export class MessagesController {
  constructor(
    private readonly service: MessagesService,

    private readonly messageReadService: MessageReadService,

    private readonly validators: MessagesRequestValidators,

    private readonly createRequestMapper: CreateMessageRequestMapper,

    private readonly socketPublisher: SocketEventPublisher,
  ) {}

  async getMessages(request: Request, response: Response): Promise<void> {
    if (!request.user) {
      throw new UnauthorizedError("Unauthorized.", "UNAUTHORIZED");
    }

    const chatId = requireId(request.params.id, "chatId");

    const dto = this.validators.getMessages.validate(request);

    const result = await this.service.getMessages(chatId, request.user.userId, dto);

    response.json(result);
  }

  async create(
    request: Request,

    response: Response,
  ): Promise<void> {
    const dto = this.validators.create.validate(request);

    if (!request.user) {
      throw new Error("Authenticated user is missing.");
    }

    const id = request.params.id;

    if (typeof id !== "string") {
      throw new ValidationError("Chat id is required.");
    }

    const message = await this.service.create(
      this.createRequestMapper.map(
        dto,

        id,

        request.user.userId,
      ),
    );

    this.socketPublisher.messageCreated(message);

    response

      .status(201)

      .json(message);
  }

  async findById(
    request: Request,

    response: Response,
  ): Promise<void> {
    const id = request.params.id;

    if (typeof id !== "string") {
      throw new ValidationError("Message id is required.");
    }

    if (!request.user) {
      throw new Error("Authenticated user is missing.");
    }

    const message = await this.service.findById(
      id,

      request.user.userId,
    );

    response.json(message);
  }

  async update(
    request: Request,

    response: Response,
  ): Promise<void> {
    if (!request.user) {
      throw new UnauthorizedError(
        "Unauthorized.",

        "UNAUTHORIZED",
      );
    }

    const id = requireId(
      request.params.id,

      "messageId",
    );

    const dto = this.validators.update.validate(request);

    const message = await this.service.update(
      id,

      request.user.userId,

      dto,
    );

    this.socketPublisher.messageUpdated(message);

    response.json(message);
  }

  async delete(
    request: Request,

    response: Response,
  ): Promise<void> {
    const id = request.params.id;

    if (typeof id !== "string") {
      throw new ValidationError("Message id is required.");
    }

    if (!request.user) {
      throw new Error("Authenticated user is missing.");
    }

    const message = await this.service.delete(
      id,

      request.user.userId,
    );

    this.socketPublisher.messageDeleted(message);

    response.json(message);
  }

  async findPinnedMessages(
    request: Request,

    response: Response,
  ): Promise<void> {
    if (!request.user) {
      throw new UnauthorizedError(
        "Unauthorized.",

        "UNAUTHORIZED",
      );
    }

    const chatId = requireId(
      request.params.chatId,

      "chatId",
    );

    const messages = await this.service.findPinnedMessages(
      chatId,

      request.user.userId,
    );

    response.json(messages);
  }

  async pinMessage(
    request: Request,

    response: Response,
  ): Promise<void> {
    if (!request.user) {
      throw new UnauthorizedError(
        "Unauthorized.",

        "UNAUTHORIZED",
      );
    }

    const messageId = requireId(
      request.params.id,

      "messageId",
    );

    const message = await this.service.pinMessage(
      messageId,

      request.user.userId,
    );

    this.socketPublisher.messagePinned(message);

    response.status(200).json(message);
  }

  async unpinMessage(
    request: Request,

    response: Response,
  ): Promise<void> {
    if (!request.user) {
      throw new UnauthorizedError(
        "Unauthorized.",

        "UNAUTHORIZED",
      );
    }

    const messageId = requireId(
      request.params.id,

      "messageId",
    );

    const message = await this.service.unpinMessage(
      messageId,

      request.user.userId,
    );

    this.socketPublisher.messageUnpinned(message);

    response.status(200).json(message);
  }

  async markRead(request: Request, response: Response): Promise<void> {
    if (!request.user) {
      throw new UnauthorizedError("Unauthorized.", "UNAUTHORIZED");
    }

    const messageId = requireId(request.params.id, "messageId");

    await this.messageReadService.markRead(messageId, request.user.userId);

    response.sendStatus(204);
  }

  async search(request: Request, response: Response): Promise<void> {
    if (!request.user) {
      throw new UnauthorizedError("Unauthorized.", "UNAUTHORIZED");
    }

    const chatId = String(request.params.id);

    const query = String(request.query.query ?? "");

    const limit = Number(request.query.limit ?? 30);

    const result = await this.service.search(chatId, request.user.userId, query, limit);

    response.json(result);
  }
}
