import {
    UnauthorizedError,
} from "../../../core/errors/index.js";

import type {
    JwtPayload,
    JwtService,
    PasswordHasher,
} from "../../../core/security/index.js";

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

export class AuthService {

    constructor(

        private readonly usersRepository: IUsersRepository,

        private readonly usersService: UsersService,

        private readonly passwordHasher: PasswordHasher,

        private readonly jwtService: JwtService,

    ) { }

    private createAuthResult(
        user: User,
    ): AuthResult {

        const payload: JwtPayload = {

            userId: user.id,

            email: user.email,

        };

        return {

            accessToken:
                this.jwtService.signAccessToken(
                    payload,
                ),

            refreshToken:
                this.jwtService.signRefreshToken(
                    payload,
                ),

            user,

        };

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

        return this.createAuthResult(user);

    }

    async register(
        dto: RegisterRequestDto,
    ): Promise<AuthResult> {

        const user =
            await this.usersService.createUser(dto);

        return this.createAuthResult(user);

    }

}