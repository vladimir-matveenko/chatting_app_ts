import type { JwtService } from "../../core/security/jwt/index.js";

import type { UsersFeature } from "../users/index.js";

import type { AuthModule } from "./auth.module.interface.js";

import { AuthController } from "./controllers/auth.controller.js";

import { AuthMappers } from "./mappers/auth.mappers.js";

import { AuthService } from "./services/auth.service.js";

import { createAuthRouter } from "./routes/auth.routes.js";

import { AuthRequestValidators } from "./validators/auth-request.validators.js";

import { LoginRequestValidator } from "./validators/login-request.validator.js";

import { RegisterRequestValidator } from "./validators/register-request.validator.js";

import { RefreshTokenRequestValidator } from "./validators/refresh-token-request.validator.js";
import { PasswordHasher } from "../../core/security/password/index.js";
import { TokenHasher } from "../../core/security/index.js";
import { JwtAuthMiddleware } from "../../core/middleware/jwt-auth.middleware.js";
import { IResetPasswordRepository } from "./interfaces/reset-password.repository.interface.js";
import { ResetPasswordRequestValidators } from "./validators/reset-password-request.validators.js";
import { ResetPasswordController } from "./controllers/reset-password.controller.js";
import { RequestPasswordResetRequestValidator } from "./validators/request-password-reset.validator.js";
import { VerifyPasswordResetRequestValidator } from "./validators/verify-password-reset-request.validator.js";
import { ResetPasswordRequestValidator } from "./validators/reset-password-request.validator.js";
import { ResetPasswordService } from "./services/reset-password.service.js";
import { IRefreshTokensRepository } from "./interfaces/refresh-tokens.repository.interface.js";
import { MailService } from "../../core/mail/mail.service.js";

export function createAuthModule(
  users: UsersFeature,

  passwordHasher: PasswordHasher,

  tokenHasher: TokenHasher,

  jwtService: JwtService,

  jwtAuthMiddleware: JwtAuthMiddleware,

  refreshTokensRepository: IRefreshTokensRepository,

  resetPasswordRepository: IResetPasswordRepository,

  mailService: MailService,
): AuthModule {
  const mappers = new AuthMappers(users.mappers.response);

  const service = new AuthService(
    users.repository,

    refreshTokensRepository,

    users.service,

    passwordHasher,

    tokenHasher,

    jwtService,
  );

  const validators = new AuthRequestValidators(
    new LoginRequestValidator(),

    new RegisterRequestValidator(),

    new RefreshTokenRequestValidator(),
  );

  const controller = new AuthController(
    service,

    validators,

    mappers,
  );

  const resetPasswordService = new ResetPasswordService(
    users.repository,
    resetPasswordRepository,
    passwordHasher,
    tokenHasher,
    mailService,
  );

  const resetPasswordValidators = new ResetPasswordRequestValidators(
    new RequestPasswordResetRequestValidator(),
    new VerifyPasswordResetRequestValidator(),
    new ResetPasswordRequestValidator(),
  );

  const resetPasswordController = new ResetPasswordController(
    resetPasswordService,
    resetPasswordValidators,
  );

  return {
    router: createAuthRouter(controller, resetPasswordController, jwtAuthMiddleware),

    service,

    resetPasswordService,

    repository: refreshTokensRepository,

    resetPasswordRepository,

    mappers,
  };
}
