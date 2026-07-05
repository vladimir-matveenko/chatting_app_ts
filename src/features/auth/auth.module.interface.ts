import type { Router }
    from "express";

import type { AuthService }
    from "./services/auth.service.js";

import type { AuthMappers }
    from "./mappers/auth.mappers.js";

import type {
    IRefreshTokensRepository,
} from "./interfaces/refresh-tokens.repository.interface.js";

export interface AuthModule {

    readonly router: Router;

    readonly service: AuthService;

    readonly repository: IRefreshTokensRepository;

    readonly mappers: AuthMappers;

}