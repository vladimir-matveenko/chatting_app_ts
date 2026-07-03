import type { CreateUserDto } from "../dto/create-user.dto.js";
import type { User } from "../models/user.model.js";

export interface IUsersRepository {
    create(dto: CreateUserDto): Promise<User>;

    findById(id: string): Promise<User | null>;

    findByEmail(email: string): Promise<User | null>;

    findByUsername(username: string): Promise<User | null>;
}