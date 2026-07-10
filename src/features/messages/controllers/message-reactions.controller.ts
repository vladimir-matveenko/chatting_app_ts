import type { Request, Response } from "express";

import { ValidationError } from "../../../core/errors/index.js";

import { AddReactionRequestMapper } from "../mappers/add-reaction-request.mapper.js";

import { MessageReactionsService } from "../services/message-reactions.service.js";

import { AddReactionRequestValidator } from "../validators/add-reaction-request.validator.js";

export class MessageReactionsController {
  constructor(
    private readonly service: MessageReactionsService,

    private readonly addReactionRequestValidator: AddReactionRequestValidator,

    private readonly addReactionRequestMapper: AddReactionRequestMapper,
  ) {}

  async add(
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

    const dto = this.addReactionRequestValidator.validate(request.body);

    const reaction = await this.service.add(
      this.addReactionRequestMapper.map(
        dto,

        id,

        request.user.userId,
      ),
    );

    response.json(reaction);
  }

  async remove(
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

    await this.service.remove(
      id,

      request.user.userId,
    );

    response.sendStatus(204);
  }
}
