import { Database } from "../database/database.js";

import { createUsersModule, type UsersFeature } from "../../features/users/index.js";

import { createAuthModule, type AuthModule } from "../../features/auth/index.js";
import { BcryptPasswordHasher } from "../security/password/index.js";
import { JwtServiceImpl } from "../security/jwt/index.js";
import { Sha256TokenHasher } from "../security/index.js";
import { JwtAuthMiddleware } from "../middleware/jwt-auth.middleware.js";
import { RefreshTokenMapper } from "../../features/auth/mappers/refresh-token.mapper.js";
import { RefreshTokensRepository } from "../../features/auth/repositories/refresh-tokens.repository.js";
import { createHealthModule, type HealthFeature } from "../../features/health/index.js";
import { ChatsFeature, createChatsModule } from "../../features/chats/index.js";

export class ApplicationContainer {
  readonly users: UsersFeature;

  readonly auth: AuthModule;

  readonly health: HealthFeature;

  readonly chats: ChatsFeature;

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

    this.chats = createChatsModule(
      database,

      this.users.repository,

      jwtAuthMiddleware,
    );
  }
}
