import type { Router } from "express";

import type { AuthService } from "./services/auth.service.js";

import type { AuthMappers } from "./mappers/auth.mappers.js";

import type { IRefreshTokensRepository } from "./interfaces/refresh-tokens.repository.interface.js";
import { IResetPasswordRepository } from "./interfaces/reset-password.repository.interface.js";
import { ResetPasswordService } from "./services/reset-password.service.js";

export interface AuthModule {
  readonly router: Router;

  readonly service: AuthService;

  resetPasswordService: ResetPasswordService;

  readonly repository: IRefreshTokensRepository;

  resetPasswordRepository: IResetPasswordRepository;

  readonly mappers: AuthMappers;
}
