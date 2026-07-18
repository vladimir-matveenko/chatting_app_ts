import type { Request, Response } from "express";

import { UnauthorizedError, ValidationError } from "../../../core/errors/index.js";

import type { MessagesService } from "../services/messages.service.js";

import { CreateMessageRequestMapper } from "../mappers/create-message-request.mapper.js";

import { CreateMessageRequestValidator } from "../validators/create-message-request.validator.js";

import { UpdateMessageRequestValidator } from "../validators/update-message-request.validator.js";

import { requireId } from "../../../core/http/validators/index.js";
import { SocketEventPublisher } from "../../../core/websocket/socket-event.publisher.js";

export class MessagesController {
  constructor(
    private readonly service: MessagesService,

    private readonly createRequestValidator: CreateMessageRequestValidator,

    private readonly createRequestMapper: CreateMessageRequestMapper,

    private readonly updateRequestValidator: UpdateMessageRequestValidator,

    private readonly socketPublisher: SocketEventPublisher,
  ) {}

  async create(
    request: Request,

    response: Response,
  ): Promise<void> {
    const dto = this.createRequestValidator.validate(request);

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

  async findByChat(
    request: Request,

    response: Response,
  ): Promise<void> {
    const id = request.params.id;

    if (typeof id !== "string") {
      throw new ValidationError("Chat id is required.");
    }

    if (!request.user) {
      throw new Error("Authenticated user is missing.");
    }

    const before =
      typeof request.query.before === "string" ? new Date(request.query.before) : undefined;

    const limit = typeof request.query.limit === "string" ? Number(request.query.limit) : 30;

    const messages = await this.service.findByChat(
      id,

      request.user.userId,

      limit,

      before,
    );

    response.json(messages);
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

    const dto = this.updateRequestValidator.validate(request);

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
}
