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
import { SocketEventPublisher } from "../../core/websocket/socket-event.publisher.js";
import { GetMessagesRequestValidator } from "./validators/get-messages-request.validator.js";
import { MessageSearchRepository } from "./repositories/message-search.repository.js";
import { MessagesSearchMapper } from "./mappers/messages-search.mapper.js";
import { MessagesRequestValidators } from "./validators/messages-request.validators.js";

export function createMessagesModule(
  database: Database,

  chatsRepository: ChatsRepository,

  chatMembersRepository: ChatMembersRepository,

  chatReadsRepository: ChatReadsRepository,

  jwtAuthMiddleware: JwtAuthMiddleware,

  socketPublisher: SocketEventPublisher,
): MessagesFeature {
  const messagesMapper = new MessagesMapper();

  const messagesSearchMapper = new MessagesSearchMapper();

  const messageReactionMapper = new MessageReactionMapper();

  const messagesRepository = new MessagesRepository(database, messagesMapper);

  const messagesSearchRepository = new MessageSearchRepository(database, messagesSearchMapper);

  const messageReactionsRepository = new MessageReactionsRepository(
    database,
    messageReactionMapper,
  );

  const messagesService = new MessagesService(
    database,

    messagesRepository,

    messagesSearchRepository,

    chatsRepository,

    chatMembersRepository,
  );

  const messageReactionsService = new MessageReactionsService(
    messageReactionsRepository,
    messagesRepository,
    chatMembersRepository,
    socketPublisher,
  );

  const messagesValidators = new MessagesRequestValidators(
    new CreateMessageRequestValidator(),
    new UpdateMessageRequestValidator(),
    new GetMessagesRequestValidator(),
  );

  const createMessageRequestMapper = new CreateMessageRequestMapper();

  const addReactionRequestValidator = new AddReactionRequestValidator();

  const addReactionRequestMapper = new AddReactionRequestMapper();

  const messageReadService = new MessageReadService(
    messagesRepository,

    chatMembersRepository,

    chatReadsRepository,
  );

  const messagesController = new MessagesController(
    messagesService,
    messageReadService,
    messagesValidators,
    createMessageRequestMapper,
    socketPublisher,
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
