import {
    ConflictError,
    NotFoundError,
} from "../../../core/errors/index.js";

import type {
    CreateUserRequestDto,
} from "../dto/request/create-user.request.dto.js";

import type {
    CreateUserDto,
} from "../dto/create-user.dto.js";

import type {
    IUsersRepository,
} from "../interfaces/users.repository.interface.js";

import type { User }
    from "../models/user.model.js";
import { PasswordHasher } from "../../../core/security/password/index.js";
import { UpdateUserDto } from "../dto/update-user.dto.js";

export class UsersService {

    constructor(

        private readonly usersRepository: IUsersRepository,

        private readonly passwordHasher: PasswordHasher,

    ) { }

    async createUser(
        dto: CreateUserRequestDto,
    ): Promise<User> {

        await this.ensureEmailIsUnique(
            dto.email,
        );

        await this.ensureUsernameIsUnique(
            dto.username,
        );

        const passwordHash =
            await this.passwordHasher.hash(
                dto.password,
            );

        const createDto: CreateUserDto = {

            username: dto.username,

            email: dto.email,

            passwordHash,

        };

        return this.usersRepository.create(
            createDto,
        );

    }

    async findById(
        id: string,
    ): Promise<User> {

        return this.requireById(id);

    }

    async requireById(
        id: string,
    ): Promise<User> {

        const user =
            await this.usersRepository.findById(
                id,
            );

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
            await this.usersRepository.findByEmail(
                email,
            );

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

    private async ensureEmailIsUnique(
        email: string,
    ): Promise<void> {

        const exists =
            await this.usersRepository.findByEmail(
                email,
            );

        if (exists) {

            throw new ConflictError(
                "Email already exists.",
                "EMAIL_ALREADY_EXISTS",
            );

        }

    }

    private async ensureUsernameIsUnique(
        username: string,
    ): Promise<void> {

        const exists =
            await this.usersRepository.findByUsername(
                username,
            );

        if (exists) {

            throw new ConflictError(
                "Username already exists.",
                "USERNAME_ALREADY_EXISTS",
            );

        }

    }

    async update(

        id: string,

        dto: UpdateUserDto,

    ): Promise<User> {

        const user =
            await this.requireById(
                id,
            );

        await this.ensureEmailIsAvailable(

            dto.email,

            user.email,

        );

        await this.ensureUsernameIsAvailable(

            dto.username,

            user.username,

        );

        return this.usersRepository.update(

            id,

            dto,

        );

    }

    private async ensureEmailIsAvailable(

        newEmail: string | undefined,

        currentEmail: string,

    ): Promise<void> {

        if (

            newEmail === undefined ||

            newEmail === currentEmail

        ) {

            return;

        }

        const existing =
            await this.usersRepository.findByEmail(
                newEmail,
            );

        if (existing) {

            throw new ConflictError(

                "Email already exists.",

                "EMAIL_ALREADY_EXISTS",

            );

        }

    }

    private async ensureUsernameIsAvailable(

        newUsername: string | undefined,

        currentUsername: string,

    ): Promise<void> {

        if (

            newUsername === undefined ||

            newUsername === currentUsername

        ) {

            return;

        }

        const existing =
            await this.usersRepository.findByUsername(
                newUsername,
            );

        if (existing) {

            throw new ConflictError(

                "Username already exists.",

                "USERNAME_ALREADY_EXISTS",

            );

        }

    }

}