import type { Mapper } from "../../../core/mappers/mapper.js";

import type { UserListItemEntity } from "../entities/user-list-item.entity.js";

import type { UserListItem } from "../models/user-list-item.model.js";

export class UserListItemMapper implements Mapper<UserListItemEntity, UserListItem> {
  map(entity: UserListItemEntity): UserListItem {
    return {
      id: entity.id,

      username: entity.user_name,

      displayName: entity.display_name,

      avatarUrl: entity.avatar_url,
    };
  }
}
