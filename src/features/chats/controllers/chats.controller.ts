import type { Request, Response } from "express";

import type { ChatsService } from "../services/chats.service.js";

import { CreateChatRequestValidator } from "../validators/create-chat-request.validator.js";

import { CreateChatRequestMapper } from "../mappers/create-chat-request.mapper.js";
import { UnauthorizedError, ValidationError } from "../../../core/errors/index.js";
import { MessageReadService } from "../../messages/services/message-read.service.js";
import { requireBoolean, requireId } from "../../../core/http/validators/index.js";
import { AddChatMembersRequestValidator } from "../validators/add-chat-members-request.validator.js";
import { ChangeMemberRoleRequestValidator } from "../validators/change-member-role-request.validator.js";

export class ChatsController {
  constructor(
    private readonly service: ChatsService,

    private readonly messageReadService: MessageReadService,

    private readonly validator: CreateChatRequestValidator,

    private readonly addMemberValidator: AddChatMembersRequestValidator,

    private readonly memberRoleValidator: ChangeMemberRoleRequestValidator,

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

    const isArchived = requireBoolean(
      request.body.isArchived,

      "isArchived",
    );

    await this.service.archive(
      chatId,

      request.user.userId,

      {
        isArchived,
      },
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

    const isMuted = requireBoolean(
      request.body.isMuted,

      "isMuted",
    );

    await this.service.mute(
      chatId,

      request.user.userId,

      {
        isMuted,
      },
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

    const dto = this.addMemberValidator.validate(request);

    await this.service.addMembers(
      chatId,

      request.user.userId,

      dto,
    );

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

    const dto = this.memberRoleValidator.validate(request);

    await this.service.changeMemberRole(
      chatId,

      request.user.userId,

      memberId,

      dto,
    );

    response.sendStatus(204);
  }
}
