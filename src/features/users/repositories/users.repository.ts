import { BaseRepository } from "../../../core/database/base.repository.js";
import { Database } from "../../../core/database/database.js";
import { InternalServerError } from "../../../core/errors/index.js";
import type { CreateUserDto } from "../dto/create-user.dto.js";
import { UpdateUserDto } from "../dto/update-user.dto.js";
import type { UserEntity } from "../entities/user.entity.js";
import type { IUsersRepository } from "../interfaces/users.repository.interface.js";
import { UserCredentialsMapper } from "../mappers/user-credentials.mapper.js";
import { UserListItemMapper } from "../mappers/user-list-item.mapper.js";
import { UsersMappers } from "../mappers/users.mappers.js";
import type { UserCredentials } from "../models/user-credentials.model.js";
import type { User } from "../models/user.model.js";
import { UsersQueries } from "../users.queries.js";

export class UsersRepository extends BaseRepository<UserEntity, User> implements IUsersRepository {
  private readonly credentialsMapper: UserCredentialsMapper;

  private readonly userListItemMapper: UserListItemMapper;

  constructor(db: Database, mappers: UsersMappers) {
    super(db, mappers.user);

    this.credentialsMapper = mappers.credentials;

    this.userListItemMapper = mappers.userListItem;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const entity = await this.queryOne(UsersQueries.CREATE, [
      dto.userName,
      dto.email,
      dto.passwordHash,
    ]);

    if (!entity) {
      throw new InternalServerError("User was not created.", "USER_CREATE_FAILED");
    }

    return this.map(entity);
  }

  async findById(id: string): Promise<User | null> {
    return this.findOne(UsersQueries.FIND_BY_ID, [id]);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne(UsersQueries.FIND_BY_EMAIL, [email]);
  }

  async findByUsername(userName: string): Promise<User | null> {
    return this.findOne(UsersQueries.FIND_BY_USERNAME, [userName]);
  }

  async findCredentialsByEmail(email: string): Promise<UserCredentials | null> {
    const entity = await this.queryOne(UsersQueries.FIND_BY_EMAIL, [email]);

    return entity ? this.credentialsMapper.map(entity) : null;
  }

  async findCredentialsById(id: string): Promise<UserCredentials | null> {
    return this.findOne(
      UsersQueries.FIND_CREDENTIALS_BY_ID,

      [id],
    );
  }

  async update(
    id: string,

    dto: UpdateUserDto,
  ): Promise<User> {
    return this.saveOne(
      UsersQueries.UPDATE_USER,

      [id, dto.email ?? null, dto.userName ?? null, dto.displayName ?? null],
    );
  }

  async updatePassword(
    id: string,

    passwordHash: string,
  ): Promise<User> {
    return this.saveOne(
      UsersQueries.UPDATE_PASSWORD,

      [id, passwordHash],
    );
  }

  async findByIds(ids: string[]): Promise<User[]> {
    return this.findMany(
      UsersQueries.FIND_BY_IDS,

      [ids],
    );
  }

  async updateAvatar(
    id: string,
    avatarUrl: string | null,
    avatarPublicId: string | null,
  ): Promise<User> {
    return this.saveOne(UsersQueries.UPDATE_AVATAR, [id, avatarUrl, avatarPublicId]);
  }
}
