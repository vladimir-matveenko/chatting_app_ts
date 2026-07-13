import type { Database } from "../../core/database/database.js";

import { JwtAuthMiddleware } from "../../core/middleware/jwt-auth.middleware.js";

import type { ChatsRepository } from "../chats/repositories/chats.repository.js";
import type { ChatMembersRepository } from "../chats/repositories/chat-members.repository.js";

import type { MessagesFeature } from "./messages.module.interface.js";

import { MessagesController } from "./controllers/messages.controller.js";
import { MessageReactionsController } from "./controllers/message-reactions.controller.js";

import { MessagesMapper } from "./mappers/messages.mapper.js";
import { MessageReactionMapper } from "./mappers/message-reaction.mapper.js";
import { CreateMessageRequestMapper } from "./mappers/create-message-request.mapper.js";
import { UpdateMessageRequestMapper } from "./mappers/update-message-request.mapper.js";
import { AddReactionRequestMapper } from "./mappers/add-reaction-request.mapper.js";

import { MessagesRepository } from "./repositories/messages.repository.js";
import { MessageReactionsRepository } from "./repositories/message-reactions.repository.js";

import { MessagesService } from "./services/messages.service.js";
import { MessageReactionsService } from "./services/message-reactions.service.js";

import { createMessagesRouter } from "./routes/messages.routes.js";

import { CreateMessageRequestValidator } from "./validators/create-message-request.validator.js";
import { UpdateMessageRequestValidator } from "./validators/update-message-request.validator.js";
import { AddReactionRequestValidator } from "./validators/add-reaction-request.validator.js";
import { ChatReadsRepository } from "./repositories/chat-reads.repository.js";
import { MessageReadService } from "./services/message-read.service.js";

export function createMessagesModule(
  database: Database,

  chatsRepository: ChatsRepository,

  chatMembersRepository: ChatMembersRepository,

  chatReadsRepository: ChatReadsRepository,

  jwtAuthMiddleware: JwtAuthMiddleware,
): MessagesFeature {
  const messagesMapper = new MessagesMapper();

  const messageReactionMapper = new MessageReactionMapper();

  const messagesRepository = new MessagesRepository(database, messagesMapper);

  const messageReactionsRepository = new MessageReactionsRepository(
    database,
    messageReactionMapper,
  );

  const messagesService = new MessagesService(
    database,

    messagesRepository,

    chatsRepository,

    chatMembersRepository,
  );

  const messageReactionsService = new MessageReactionsService(
    messageReactionsRepository,
    messagesRepository,
    chatMembersRepository,
  );

  const createMessageRequestValidator = new CreateMessageRequestValidator();

  const createMessageRequestMapper = new CreateMessageRequestMapper();

  const updateMessageRequestValidator = new UpdateMessageRequestValidator();

  const updateMessageRequestMapper = new UpdateMessageRequestMapper();

  const addReactionRequestValidator = new AddReactionRequestValidator();

  const addReactionRequestMapper = new AddReactionRequestMapper();

  const messagesController = new MessagesController(
    messagesService,
    createMessageRequestValidator,
    createMessageRequestMapper,
    updateMessageRequestValidator,
    updateMessageRequestMapper,
  );

  const messageReactionsController = new MessageReactionsController(
    messageReactionsService,
    addReactionRequestValidator,
    addReactionRequestMapper,
  );

  const router = createMessagesRouter(
    messagesController,
    messageReactionsController,
    jwtAuthMiddleware,
  );

  const messageReadService = new MessageReadService(
    messagesRepository,

    chatMembersRepository,

    chatReadsRepository,
  );

  return {
    router,

    controller: messagesController,

    service: messagesService,

    messageReactionsService,

    repository: messagesRepository,

    messageReactionsRepository,

    messageReadService,
  };
}
