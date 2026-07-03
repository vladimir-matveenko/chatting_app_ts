import { CreateUserDto } from "../dto/create-user.dto.js";
import { IUsersRepository } from "../interfaces/users.repository.interface.js";
import { User } from "../models/user.model.js";
import {
    ConflictError,
    NotFoundError,
} from "../../../core/errors/index.js";
import { CreateUserRequestDto } from "../dto/request/create-user.request.dto.js";
import type { PasswordHasher } from "../../../core/security/index.js";

export class UsersService {
    constructor(
        private readonly usersRepository: IUsersRepository,
        private readonly passwordHasher: PasswordHasher,
    ) { }

    async create(
        request: CreateUserRequestDto,
    ): Promise<User> {

        const emailExists =
            await this.usersRepository.findByEmail(
                request.email,
            );

        if (emailExists) {
            throw new ConflictError(
                "Email already exists.",
                "EMAIL_ALREADY_EXISTS",
            );
        }

        const usernameExists =
            await this.usersRepository.findByUsername(
                request.username,
            );

        if (usernameExists) {
            throw new ConflictError(
                "Username already exists.",
                "USERNAME_ALREADY_EXISTS",
            );
        }

        const dto: CreateUserDto = {

            username: request.username,

            email: request.email,

            passwordHash:
                await this.passwordHasher.hash(
                    request.password,
                ),

        };

        return this.usersRepository.create(
            dto,
        );

    }

    async requireById(
        id: string,
    ): Promise<User> {

        const user =
            await this.usersRepository.findById(id);

        if (!user) {
            throw new NotFoundError(
                "User not found.",
                "USER_NOT_FOUND",
            );
        }

        return user;
    }

    async getByEmail(
        email: string,
    ): Promise<User> {

        const user =
            await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new NotFoundError(
                "User not found.",
                "USER_NOT_FOUND",
            );
        }

        return user;
    }

    async getByUsername(
        username: string,
    ): Promise<User> {

        const user =
            await this.usersRepository.findByUsername(
                username,
            );

        if (!user) {
            throw new NotFoundError(
                "User not found.",
                "USER_NOT_FOUND",
            );
        }

        return user;
    }
}