import type { Request, Response } from "express";

import type { ChatsService } from "../services/chats.service.js";

import { CreateChatRequestValidator } from "../validators/create-chat-request.validator.js";

import { CreateChatRequestMapper } from "../mappers/create-chat-request.mapper.js";
import { ValidationError } from "../../../core/errors/index.js";
import { MessageReadService } from "../../messages/services/message-read.service.js";

export class ChatsController {
  constructor(
    private readonly service: ChatsService,

    private readonly messageReadService: MessageReadService,

    private readonly validator: CreateChatRequestValidator,

    private readonly mapper: CreateChatRequestMapper,
  ) {}

  async create(
    request: Request,

    response: Response,
  ): Promise<void> {
    const dto = this.validator.validate(request);

    if (!request.user) {
      throw new Error("Authenticated user is missing.");
    }

    const chat = await this.service.create(
      this.mapper.map(
        dto,

        request.user.userId,
      ),
    );

    response.status(201).json(chat);
  }

  async list(
    request: Request,

    response: Response,
  ): Promise<void> {
    if (!request.user) {
      throw new Error("Authenticated user is missing.");
    }

    const chats = await this.service.findByUser(request.user.userId);

    response.json(chats);
  }

  async findById(
    request: Request,

    response: Response,
  ): Promise<void> {
    const id = request.params.id;

    if (typeof id !== "string") {
      throw new ValidationError("Chat id is required.");
    }

    const chat = await this.service.findById(
      id,

      request.user!.userId,
    );

    response.json(chat);
  }

  async findMembers(
    request: Request,

    response: Response,
  ): Promise<void> {
    const id = request.params.id;

    if (typeof id !== "string") {
      throw new ValidationError("Chat id is required.");
    }

    const members = await this.service.findMembers(
      id,

      request.user!.userId,
    );

    response.json(members);
  }

  async markRead(
    request: Request,

    response: Response,
  ): Promise<void> {
    const chatId = request.params.id;

    if (typeof chatId !== "string") {
      throw new ValidationError("Chat id is required.");
    }

    const { messageId } = request.body as {
      messageId?: string;
    };

    if (!messageId) {
      throw new ValidationError("Message id is required.");
    }

    await this.messageReadService.markRead(
      chatId,

      messageId,

      request.user!.userId,
    );

    response.sendStatus(204);
  }
}
