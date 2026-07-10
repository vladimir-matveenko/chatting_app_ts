import type { Request, Response } from "express";

import { ValidationError } from "../../../core/errors/index.js";

import type { MessagesService } from "../services/messages.service.js";

import { CreateMessageRequestMapper } from "../mappers/create-message-request.mapper.js";

import { CreateMessageRequestValidator } from "../validators/create-message-request.validator.js";

export class MessagesController {
  constructor(
    private readonly service: MessagesService,

    private readonly validator: CreateMessageRequestValidator,

    private readonly mapper: CreateMessageRequestMapper,
  ) {}

  async create(
    request: Request,

    response: Response,
  ): Promise<void> {
    const dto = this.validator.validate(request);

    if (!request.user) {
      throw new Error("Authenticated user is missing.");
    }

    const id = request.params.id;

    if (typeof id !== "string") {
      throw new ValidationError("Chat id is required.");
    }

    const message = await this.service.create(
      this.mapper.map(
        dto,

        id,

        request.user.userId,
      ),
    );

    response

      .status(201)

      .json(message);
  }
}
