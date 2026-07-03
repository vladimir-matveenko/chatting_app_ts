
import { BaseRepository } from "../../../core/database/base.repository.js";
import { Database } from "../../../core/database/database.js";
import { InternalServerError } from "../../../core/errors/index.js";
import { CreateUserDto } from "../dto/create-user.dto.js";
import { UserEntity } from "../entities/user.entity.js";
import { IUsersRepository } from "../interfaces/users.repository.interface.js";
import { UserCredentialsMapper } from "../mappers/user-credentials.mapper.js";
import { UserMapper } from "../mappers/user.mapper.js";
import { UserCredentials } from "../models/user-credentials.model.js";
import { User } from "../models/user.model.js";
import { UsersQueries } from "../users.queries.js";

export class UsersRepository extends BaseRepository<
    UserEntity,
    User
> implements IUsersRepository {

    constructor(
        db: Database,
        mapper: UserMapper,
        private readonly credentialsMapper: UserCredentialsMapper,
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

        const entity = this.getOne(result);

        if (!entity) {
            throw new InternalServerError(
                "User was not created.",
                "USER_CREATE_FAILED",
            );
        }

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

    async findCredentialsByEmail(
        email: string,
    ): Promise<UserCredentials | null> {

        const result =
            await this.db.query<UserEntity>(
                UsersQueries.FIND_BY_EMAIL,
                [email],
            );

        const entity =
            this.getOneOrNull(result);

        if (!entity) {
            return null;
        }

        return this.credentialsMapper.map(
            entity,
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