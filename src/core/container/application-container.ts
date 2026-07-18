import { Database } from "../database/database.js";

import { createUsersModule, type UsersFeature } from "../../features/users/index.js";

import { createAuthModule, type AuthModule } from "../../features/auth/index.js";
import { BcryptPasswordHasher } from "../security/password/index.js";
import { JwtService, JwtServiceImpl } from "../security/jwt/index.js";
import { Sha256TokenHasher } from "../security/index.js";
import { JwtAuthMiddleware } from "../middleware/jwt-auth.middleware.js";
import { RefreshTokenMapper } from "../../features/auth/mappers/refresh-token.mapper.js";
import { RefreshTokensRepository } from "../../features/auth/repositories/refresh-tokens.repository.js";
import { createHealthModule, type HealthFeature } from "../../features/health/index.js";
import { ChatsFeature, createChatsModule } from "../../features/chats/index.js";
import { ChatMapper } from "../../features/chats/mappers/chats.mapper.js";
import { ChatsRepository } from "../../features/chats/repositories/chats.repository.js";
import { ChatMembersMapper } from "../../features/chats/mappers/chat-members.mapper.js";
import { ChatMembersRepository } from "../../features/chats/repositories/chat-members.repository.js";
import { ChatListItemMapper } from "../../features/chats/mappers/chat-list-item.mapper.js";
import { ChatListRepository } from "../../features/chats/repositories/chat-list.repository.js";
import { ChatReadsRepository } from "../../features/messages/repositories/chat-reads.repository.js";
import { createMessagesModule, type MessagesFeature } from "../../features/messages/index.js";
import { SocketAuthMiddleware } from "../websocket/socket-auth.middleware.js";

export class ApplicationContainer {
  readonly users: UsersFeature;

  readonly auth: AuthModule;

  readonly health: HealthFeature;

  readonly chats: ChatsFeature;

  readonly messages: MessagesFeature;

  readonly jwtService: JwtService;

  readonly socketAuthMiddleware: SocketAuthMiddleware;

  constructor(database: Database) {
    const passwordHasher = new BcryptPasswordHasher();

    const jwtService = new JwtServiceImpl();

    const tokenHasher = new Sha256TokenHasher();

    const jwtAuthMiddleware = new JwtAuthMiddleware(jwtService);

    const refreshTokenMapper = new RefreshTokenMapper();

    const refreshTokensRepository = new RefreshTokensRepository(database, refreshTokenMapper);

    this.users = createUsersModule(
      database,
      jwtAuthMiddleware,
      passwordHasher,
      refreshTokensRepository,
    );

    this.auth = createAuthModule(
      this.users,

      passwordHasher,

      tokenHasher,

      jwtService,

      jwtAuthMiddleware,

      refreshTokensRepository,
    );

    this.health = createHealthModule();

    const chatMapper = new ChatMapper();

    const chatsRepository = new ChatsRepository(database, chatMapper);

    const chatMembersMapper = new ChatMembersMapper();

    const chatMembersRepository = new ChatMembersRepository(database, chatMembersMapper);

    const chatListItemMapper = new ChatListItemMapper();

    const chatListRepository = new ChatListRepository(database, chatListItemMapper);

    const chatReadsRepository = new ChatReadsRepository(database);

    this.messages = createMessagesModule(
      database,

      chatsRepository,

      chatMembersRepository,

      chatReadsRepository,

      jwtAuthMiddleware,
    );

    this.chats = createChatsModule(
      database,

      this.users.repository,

      chatsRepository,

      chatListRepository,

      chatMembersRepository,

      this.messages.messageReadService,

      jwtAuthMiddleware,
    );

    this.jwtService = new JwtServiceImpl();

    this.socketAuthMiddleware = new SocketAuthMiddleware(this.jwtService);
  }
}
