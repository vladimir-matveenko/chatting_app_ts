import { Database } from "../database/database.js";

import { createUsersModule, type UsersFeature } from "../../features/users/index.js";
import { createAuthModule, type AuthModule } from "../../features/auth/index.js";
import { createHealthModule, type HealthFeature } from "../../features/health/index.js";
import { ChatsFeature, createChatsModule } from "../../features/chats/index.js";
import { createMessagesModule, type MessagesFeature } from "../../features/messages/index.js";

import { ChatMapper } from "../../features/chats/mappers/chats.mapper.js";
import { ChatMembersMapper } from "../../features/chats/mappers/chat-members.mapper.js";
import { ChatListItemMapper } from "../../features/chats/mappers/chat-list-item.mapper.js";

import { ChatsRepository } from "../../features/chats/repositories/chats.repository.js";
import { ChatMembersRepository } from "../../features/chats/repositories/chat-members.repository.js";
import { ChatListRepository } from "../../features/chats/repositories/chat-list.repository.js";

import { ChatReadsRepository } from "../../features/messages/repositories/chat-reads.repository.js";

import { RefreshTokenMapper } from "../../features/auth/mappers/refresh-token.mapper.js";
import { RefreshTokensRepository } from "../../features/auth/repositories/refresh-tokens.repository.js";

import { BcryptPasswordHasher } from "../security/password/index.js";
import { JwtService, JwtServiceImpl } from "../security/jwt/index.js";
import { Sha256TokenHasher } from "../security/index.js";

import { JwtAuthMiddleware } from "../middleware/jwt-auth.middleware.js";
import { SocketAuthMiddleware } from "../middleware/socket-auth.middleware.js";

import { SocketGateway } from "../websocket/socket.gateway.js";
import { ChatRoomService } from "../websocket/services/chat-room.service.js";
import { PresenceService } from "../websocket/services/presence.service.js";

import { ChatHandler, ReadHandler, TypingHandler } from "../websocket/handlers/index.js";
import { ChatPermissionsService } from "../../features/chats/services/chat-permissions.service.js";
import { SocketEventPublisher } from "../websocket/publishers/socket-event.publisher.js";
import { NotificationsFeature } from "../../features/notifications/notifications.module.interface.js";
import { createNotificationsModule } from "../../features/notifications/notifications.module.js";
import { LocalFileStorage } from "../storage/local-file-storage.js";
import path from "node:path";

export class ApplicationContainer {
  readonly users: UsersFeature;

  readonly auth: AuthModule;

  readonly health: HealthFeature;

  readonly chats: ChatsFeature;

  readonly messages: MessagesFeature;

  readonly jwtService: JwtService;

  readonly socketAuthMiddleware: SocketAuthMiddleware;

  readonly socketEventPublisher: SocketEventPublisher;

  readonly chatRoomService: ChatRoomService;

  readonly presenceService: PresenceService;

  readonly socketGateway: SocketGateway;

  readonly notifications: NotificationsFeature;

  constructor(database: Database) {
    //
    // Security
    //

    const passwordHasher = new BcryptPasswordHasher();

    this.jwtService = new JwtServiceImpl();

    const tokenHasher = new Sha256TokenHasher();

    const jwtAuthMiddleware = new JwtAuthMiddleware(this.jwtService);

    this.socketAuthMiddleware = new SocketAuthMiddleware(this.jwtService);

    //
    // Auth repositories
    //

    const refreshTokenMapper = new RefreshTokenMapper();

    const refreshTokensRepository = new RefreshTokensRepository(database, refreshTokenMapper);

    //
    // Chat repositories
    //

    const chatMapper = new ChatMapper();

    const chatsRepository = new ChatsRepository(database, chatMapper);

    const chatMembersMapper = new ChatMembersMapper();

    const chatMembersRepository = new ChatMembersRepository(database, chatMembersMapper);

    const chatListItemMapper = new ChatListItemMapper();

    const chatListRepository = new ChatListRepository(database, chatListItemMapper);

    const chatReadsRepository = new ChatReadsRepository(database);

    //
    // Shared WebSocket infrastructure
    //

    this.socketEventPublisher = new SocketEventPublisher();

    this.chatRoomService = new ChatRoomService(chatMembersRepository);

    this.presenceService = new PresenceService();

    const fileStorage = new LocalFileStorage(path.resolve("uploads"));

    //
    // Features
    //

    this.users = createUsersModule(
      database,
      jwtAuthMiddleware,
      passwordHasher,
      refreshTokensRepository,
      fileStorage,
    );

    this.auth = createAuthModule(
      this.users,
      passwordHasher,
      tokenHasher,
      this.jwtService,
      jwtAuthMiddleware,
      refreshTokensRepository,
    );

    this.health = createHealthModule();

    // notifications module
    this.notifications = createNotificationsModule(
      database,
      jwtAuthMiddleware,
      this.socketEventPublisher,
    );

    this.messages = createMessagesModule(
      database,
      chatsRepository,
      chatMembersRepository,
      chatReadsRepository,
      jwtAuthMiddleware,
      this.socketEventPublisher,
      this.notifications.service,
    );

    const chatPermissionsService = new ChatPermissionsService(
      chatMembersRepository,
      chatsRepository,
    );

    this.chats = createChatsModule(
      database,
      this.users.repository,
      chatsRepository,
      chatListRepository,
      chatMembersRepository,
      this.messages.messageReadService,
      jwtAuthMiddleware,
      this.socketEventPublisher,
      this.presenceService,
      chatPermissionsService,
      this.notifications.service,
    );

    //
    // Socket handlers
    //

    const handlers = [
      new ChatHandler(this.chatRoomService),

      new TypingHandler(this.chatRoomService, this.socketEventPublisher),

      new ReadHandler(this.messages.messageReadService, this.socketEventPublisher),
    ];

    //
    // Socket gateway
    //

    this.socketGateway = new SocketGateway(
      this.presenceService,
      this.socketEventPublisher,
      handlers,
    );
  }
}
