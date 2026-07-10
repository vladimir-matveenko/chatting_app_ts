import type { Database } from "../../core/database/database.js";

import type { ChatsRepository } from "../chats/repositories/chats.repository.js";

import type { ChatMembersRepository } from "../chats/repositories/chat-members.repository.js";

import { MessagesMapper } from "./mappers/messages.mapper.js";

import { CreateMessageRequestMapper } from "./mappers/create-message-request.mapper.js";

import { MessagesRepository } from "./repositories/messages.repository.js";

import { MessagesService } from "./services/messages.service.js";

import { MessagesController } from "./controllers/messages.controller.js";

import { createMessagesRouter } from "./routes/messages.routes.js";

import { CreateMessageRequestValidator } from "./validators/create-message-request.validator.js";

import type { MessagesFeature } from "./messages.module.interface.js";

import { JwtAuthMiddleware } from "../../core/middleware/jwt-auth.middleware.js";
import { UpdateMessageRequestValidator } from "./validators/update-message-request.validator.js";
import { UpdateMessageRequestMapper } from "./mappers/update-message-request.mapper.js";

export function createMessagesModule(
  database: Database,

  chatsRepository: ChatsRepository,

  chatMembersRepository: ChatMembersRepository,

  jwtAuthMiddleware: JwtAuthMiddleware,
): MessagesFeature {
  const mapper = new MessagesMapper();

  const repository = new MessagesRepository(
    database,

    mapper,
  );

  const service = new MessagesService(
    database,

    repository,

    chatsRepository,

    chatMembersRepository,
  );

  const createRequestValidator = new CreateMessageRequestValidator();

  const createRequestMapper = new CreateMessageRequestMapper();

  const updateRequestValidator = new UpdateMessageRequestValidator();

  const updateRequestMapper = new UpdateMessageRequestMapper();

  const controller = new MessagesController(
    service,

    createRequestValidator,

    createRequestMapper,

    updateRequestValidator,

    updateRequestMapper,
  );

  const router = createMessagesRouter(
    controller,

    jwtAuthMiddleware,
  );

  return {
    router,

    controller,

    service,

    repository,

    mapper,
  };
}
