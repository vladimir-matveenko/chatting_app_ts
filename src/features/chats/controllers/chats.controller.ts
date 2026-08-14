import type { Request, Response } from "express";

import type { ChatsService } from "../services/chats.service.js";

import { CreateChatRequestMapper } from "../mappers/create-chat-request.mapper.js";
import { UnauthorizedError, ValidationError } from "../../../core/errors/index.js";
import { MessageReadService } from "../../messages/services/message-read.service.js";
import { ChatsRequestValidators } from "../validators/chats-request.validators.js";
import { requireId } from "../../../core/http/validators/index.js";
import { SocketEventPublisher } from "../../../core/websocket/publishers/socket-event.publisher.js";
import { logger } from "../../../core/logger/logger.js";

export class ChatsController {
  constructor(
    private readonly service: ChatsService,

    private readonly messageReadService: MessageReadService,

    private readonly validators: ChatsRequestValidators,

    private readonly mapper: CreateChatRequestMapper,

    private readonly socketPublisher: SocketEventPublisher,
  ) {}

  async create(
    request: Request,

    response: Response,
  ): Promise<void> {
    const dto = this.validators.create.validate(request);

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

    const dto = this.validators.findChats.validate(request.query);

    const chats = await this.service.findByUser(request.user.userId, dto);

    response.json(chats);
  }

  async archivedList(
    request: Request,

    response: Response,
  ): Promise<void> {
    if (!request.user) {
      throw new Error("Authenticated user is missing.");
    }

    const dto = this.validators.findChats.validate(request.query);

    const chats = await this.service.findArchivedByUser(request.user.userId, dto);

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

    const dto = this.validators.findMembers.validate(request.query);

    const members = await this.service.findMembers(
      id,

      request.user!.userId,

      dto,
    );

    response.json(members);
  }

  async findMemberById(
    request: Request,

    response: Response,
  ): Promise<void> {
    const id = request.params.id;

    if (typeof id !== "string") {
      throw new ValidationError("Chat id is required.");
    }

    const userId = request.params.userId;

    if (typeof userId !== "string") {
      throw new ValidationError("User id is required.");
    }

    const member = await this.service.findMemberById(
      id,

      userId,
    );

    response.json(member);
  }

  async getMefromChat(
    request: Request,

    response: Response,
  ): Promise<void> {
    const id = request.params.id;

    if (typeof id !== "string") {
      throw new ValidationError("Chat id is required.");
    }

    logger.error(request.user!.userId);

    const member = await this.service.findMemberById(
      id,

      request.user!.userId,
    );

    response.json(member);
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
      messageId,

      request.user!.userId,
    );

    response.sendStatus(204);
  }

  async archive(
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
      request.params.id,

      "chatId",
    );

    const dto = this.validators.archive.validate(request);

    await this.service.archive(
      chatId,

      request.user.userId,

      dto,
    );

    response.sendStatus(204);
  }

  async mute(
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
      request.params.id,

      "chatId",
    );

    const dto = this.validators.mute.validate(request);

    await this.service.mute(
      chatId,

      request.user.userId,

      dto,
    );

    response.sendStatus(204);
  }

  async leave(
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
      request.params.id,

      "chatId",
    );

    await this.service.leave(
      chatId,

      request.user.userId,
    );

    response.sendStatus(204);
  }

  async addMembers(
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
      request.params.id,

      "chatId",
    );

    const dto = this.validators.addMembers.validate(request);

    await this.service.addMembers(
      chatId,

      request.user.userId,

      dto,
    );

    this.socketPublisher.chatChanged(chatId);

    response.sendStatus(204);
  }

  async removeMember(
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
      request.params.id,

      "chatId",
    );

    const memberId = requireId(
      request.params.userId,

      "userId",
    );

    await this.service.removeMember(
      chatId,

      request.user.userId,

      memberId,
    );

    this.socketPublisher.chatChanged(chatId);

    response.sendStatus(204);
  }

  async changeMemberRole(
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
      request.params.id,

      "chatId",
    );

    const memberId = requireId(
      request.params.userId,

      "userId",
    );

    const dto = this.validators.changeRole.validate(request);

    await this.service.changeMemberRole(
      chatId,

      request.user.userId,

      memberId,

      dto,
    );

    this.socketPublisher.chatChanged(chatId);

    response.sendStatus(204);
  }

  async transferOwnership(
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
      request.params.id,

      "chatId",
    );

    const dto = this.validators.transferOwnership.validate(request);

    await this.service.transferOwnership(
      chatId,

      request.user.userId,

      dto,
    );

    this.socketPublisher.chatChanged(chatId);

    response.sendStatus(204);
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

    const chatId = requireId(
      request.params.id,

      "chatId",
    );

    const dto = this.validators.update.validate(request);

    const chat = await this.service.update(
      chatId,

      request.user.userId,

      dto,
    );

    this.socketPublisher.chatChanged(chat.id);

    response.json(chat);
  }
}
