import { BaseRepository } from "../../../core/database/base.repository.js";
import { Database } from "../../../core/database/database.js";
import { FindUsersDto } from "../dto/find-users.dto.js";
import { UserListItemEntity } from "../entities/user-list-item.entity.js";
import { IUserListRepository } from "../interfaces/user-list.repository.interface.js";
import { UsersMappers } from "../mappers/users.mappers.js";
import { UserListItem } from "../models/user-list-item.model.js";
import { UsersQueries } from "../users.queries.js";

export class UserListRepository
  extends BaseRepository<UserListItemEntity, UserListItem>
  implements IUserListRepository
{
  constructor(db: Database, mappers: UsersMappers) {
    super(db, mappers.userListItem);
  }

  async search(currentUserId: string, dto: FindUsersDto): Promise<UserListItem[]> {
    return this.findMany(UsersQueries.SEARCH, [
      currentUserId,
      dto.query ?? null,
      dto.limit,
      dto.offset,
    ]);
  }
}
