import {
    UnauthorizedError,
} from "../../../core/errors/index.js";

import type {
    JwtPayload,
    JwtService,
} from "../../../core/security/jwt/index.js";

import type { LoginRequestDto }
    from "../dto/request/login.request.dto.js";

import type { RegisterRequestDto }
    from "../dto/request/register.request.dto.js";

import type { AuthResult }
    from "../models/auth-result.model.js";

import type {
    IUsersRepository,
} from "../../users/interfaces/users.repository.interface.js";
import { UsersService } from "../../users/services/users.service.js";
import { User } from "../../users/models/user.model.js";
import { IRefreshTokensRepository } from "../interfaces/refresh-tokens.repository.interface.js";
import { PasswordHasher } from "../../../core/security/password/index.js";
import { TokenHasher } from "../../../core/security/index.js";

export class AuthService {

    constructor(

        private readonly usersRepository: IUsersRepository,

        private readonly refreshTokensRepository: IRefreshTokensRepository,

        private readonly usersService: UsersService,

        private readonly passwordHasher: PasswordHasher,

        private readonly tokenHasher: TokenHasher,

        private readonly jwtService: JwtService,

    ) { }

    private async createAuthResult(
        user: User,
    ): Promise<AuthResult> {

        const payload: JwtPayload = {

            userId: user.id,

            email: user.email,

        };

        const accessToken =
            this.jwtService.signAccessToken(
                payload,
            );

        const refreshToken =
            this.jwtService.signRefreshToken(
                payload,
            );

        await this.saveRefreshToken(

            user.id,

            refreshToken,

        );

        return {

            accessToken,

            refreshToken,

            user,

        };

    }

    private async saveRefreshToken(

        userId: string,

        refreshToken: string,

    ): Promise<void> {

        const tokenHash =
            this.tokenHasher.hash(
                refreshToken,
            );

        const expiresAt =
            new Date(

                Date.now() +

                30 * 24 * 60 * 60 * 1000,

            );

        const existing =
            await this.refreshTokensRepository.findByUserId(
                userId,
            );

        if (existing) {

            await this.refreshTokensRepository.update(

                userId,

                tokenHash,

                expiresAt,

            );

            return;

        }

        await this.refreshTokensRepository.create(

            userId,

            tokenHash,

            expiresAt,

        );

    }

    async login(
        dto: LoginRequestDto,
    ): Promise<AuthResult> {

        const credentials =
            await this.usersRepository
                .findCredentialsByEmail(
                    dto.email,
                );

        if (!credentials) {

            throw new UnauthorizedError(
                "Invalid email or password.",
                "INVALID_CREDENTIALS",
            );

        }

        const passwordMatches =
            await this.passwordHasher.compare(
                dto.password,
                credentials.passwordHash,
            );

        if (!passwordMatches) {

            throw new UnauthorizedError(
                "Invalid email or password.",
                "INVALID_CREDENTIALS",
            );

        }

        const user =
            await this.usersRepository.findById(
                credentials.id,
            );

        if (!user) {

            throw new UnauthorizedError(
                "Invalid email or password.",
                "INVALID_CREDENTIALS",
            );

        }

        return await this.createAuthResult(user);

    }

    async register(
        dto: RegisterRequestDto,
    ): Promise<AuthResult> {

        const user =
            await this.usersService.createUser(dto);

        return await this.createAuthResult(user);

    }

    async refresh(
        refreshToken: string,
    ): Promise<AuthResult> {

        const payload =
            this.jwtService.verifyRefreshToken(
                refreshToken,
            );

        const storedToken =
            await this.refreshTokensRepository.findByUserId(
                payload.userId,
            );

        if (!storedToken) {

            throw new UnauthorizedError(

                "Refresh token not found.",

                "INVALID_REFRESH_TOKEN",

            );

        }

        this.ensureRefreshTokenNotExpired(
            storedToken.expiresAt,
        );

        const incomingHash =
            this.tokenHasher.hash(
                refreshToken,
            );

        if (
            incomingHash !==
            storedToken.tokenHash
        ) {

            throw new UnauthorizedError(

                "Invalid refresh token.",

                "INVALID_REFRESH_TOKEN",

            );

        }

        const user =
            await this.usersRepository.findById(
                payload.userId,
            );

        if (!user) {

            throw new UnauthorizedError(

                "User not found.",

                "USER_NOT_FOUND",

            );

        }

        return await this.createAuthResult(
            user,
        );

    }

    private ensureRefreshTokenNotExpired(
        expiresAt: Date,
    ): void {

        if (
            expiresAt.getTime() <= Date.now()
        ) {

            throw new UnauthorizedError(

                "Refresh token has expired.",

                "REFRESH_TOKEN_EXPIRED",

            );

        }

    }

    async logout(
        userId: string,
    ): Promise<void> {

        await this.refreshTokensRepository.delete(
            userId,
        );

    }

}
