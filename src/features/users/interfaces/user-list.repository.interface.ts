import { FindUsersDto } from "../dto/find-users.dto.js";
import { UserListItem } from "../models/user-list-item.model.js";

export interface IUserListRepository {
  search(currentUserId: string, dto: FindUsersDto): Promise<UserListItem[]>;
}
