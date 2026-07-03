import type { Database } from "../../core/config/database.js";
import { BaseRepository } from "../../core/database/base.repository.js";
import { InternalServerError } from "../../core/errors/index.js";

import type { CreateUserDto } from "./dto/create-user.dto.js";
import type { UserEntity } from "./entities/user.entity.js";
import { UserMapper } from "./mappers/user.mapper.js";
import type { User } from "./models/user.model.js";
import { UsersQueries } from "./users.queries.js";

export class UsersRepository extends BaseRepository<
    UserEntity,
    User
> {

    constructor(
        db: Database,
        mapper: UserMapper,
    ) {
        super(db, mapper);
    }

    async create(
        dto: CreateUserDto,
    ): Promise<User> {

        const result = await this.db.query<UserEntity>(
            UsersQueries.CREATE,
            [
                dto.username,
                dto.email,
                dto.passwordHash,
            ],
        );

        const entity = this.requireOne(
            result.rows[0] ?? null,
            new InternalServerError(
                "User was not created.",
                "USER_CREATE_FAILED",
            ),
        );

        return this.map(entity);



    }

    async findById(
        id: string,
    ): Promise<User | null> {

        const result = await this.db.query<UserEntity>(
            UsersQueries.FIND_BY_ID,
            [id],
        );

        return this.mapNullable(
            this.getOneOrNull(result),
        );

    }

    async findByEmail(
        email: string,
    ): Promise<User | null> {

        const result = await this.db.query<UserEntity>(
            UsersQueries.FIND_BY_EMAIL,
            [email],
        );

        return this.mapNullable(
            this.getOneOrNull(result),
        );

    }

    async findByUsername(
        username: string,
    ): Promise<User | null> {

        const result = await this.db.query<UserEntity>(
            UsersQueries.FIND_BY_USERNAME,
            [username],
        );

        return this.mapNullable(
            this.getOneOrNull(result),
        );

    }

}