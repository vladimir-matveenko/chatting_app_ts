import type { CreateUserDto } from "../dto/create-user.dto.js";
import { UpdateUserDto } from "../dto/update-user.dto.js";
import { UserCredentials } from "../models/user-credentials.model.js";
import type { User } from "../models/user.model.js";

export interface IUsersRepository {
    create(dto: CreateUserDto): Promise<User>;

    findCredentialsByEmail(
        email: string,
    ): Promise<UserCredentials | null>;

    findById(id: string): Promise<User | null>;

    findByEmail(email: string): Promise<User | null>;

    findByUsername(username: string): Promise<User | null>;

    findCredentialsById(id: string): Promise<UserCredentials | null>;

    update(id: string, dto: UpdateUserDto): Promise<User>;

    updatePassword(id: string, passwordHash: string): Promise<User>;

    findByIds(ids: string[]): Promise<User[]>;

}