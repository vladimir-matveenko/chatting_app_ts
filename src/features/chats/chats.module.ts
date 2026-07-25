import type { Database } from "../../core/database/database.js";

import type { UsersRepository } from "../users/repositories/users.repository.js";

import { CreateChatRequestMapper } from "./mappers/create-chat-request.mapper.js";

import { ChatsRepository } from "./repositories/chats.repository.js";

import { ChatMembersRepository } from "./repositories/chat-members.repository.js";

import { ChatFingerprintService } from "./services/chat-fingerprint.service.js";

import { ChatsService } from "./services/chats.service.js";

import { ChatsController } from "./controllers/chats.controller.js";

import { createChatsRouter } from "./routes/chats.routes.js";

import { CreateChatRequestValidator } from "./validators/create-chat-request.validator.js";

import type { ChatsFeature } from "./chats.module.interface.js";

import { JwtAuthMiddleware } from "../../core/middleware/jwt-auth.middleware.js";

import { ChatListRepository } from "./repositories/chat-list.repository.js";
import { MessageReadService } from "../messages/services/message-read.service.js";
import { AddChatMembersRequestValidator } from "./validators/add-chat-members-request.validator.js";
import { ChangeMemberRoleRequestValidator } from "./validators/change-member-role-request.validator.js";
import { TransferOwnershipRequestValidator } from "./dto/transfer-ownership-request.validator.js";
import { UpdateChatRequestValidator } from "./validators/update-chat-request.validator.js";
import { SocketEventPublisher } from "../../core/websocket/socket-event.publisher.js";
import { PresenceService } from "../../core/websocket/presence.service.js";

export function createChatsModule(
  database: Database,

  usersRepository: UsersRepository,

  chatsRepository: ChatsRepository,

  chatListRepository: ChatListRepository,

  chatMembersRepository: ChatMembersRepository,

  messageReadService: MessageReadService,

  jwtAuthMiddleware: JwtAuthMiddleware,

  socketPublisher: SocketEventPublisher,

  presenceService: PresenceService,
): ChatsFeature {
  const fingerprintService = new ChatFingerprintService();

  const service = new ChatsService(
    database,

    usersRepository,

    chatsRepository,

    chatListRepository,

    chatMembersRepository,

    fingerprintService,

    presenceService,
  );

  const validator = new CreateChatRequestValidator();

  const addMemberValidator = new AddChatMembersRequestValidator();

  const memberRoleValidator = new ChangeMemberRoleRequestValidator();

  const transferOwnershipValidator = new TransferOwnershipRequestValidator();

  const updateChatValidator = new UpdateChatRequestValidator();

  const mapper = new CreateChatRequestMapper();

  const controller = new ChatsController(
    service,

    messageReadService,

    validator,

    addMemberValidator,

    memberRoleValidator,

    transferOwnershipValidator,

    updateChatValidator,

    mapper,

    socketPublisher,
  );

  const router = createChatsRouter(
    controller,

    jwtAuthMiddleware,
  );

  return {
    router,

    controller,

    service,

    repository: chatsRepository,

    chatListRepository,

    chatMembersRepository,
  };
}
