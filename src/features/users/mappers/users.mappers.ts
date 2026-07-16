import { UserMapper } from "./user.mapper.js";
import { UserCredentialsMapper } from "./user-credentials.mapper.js";
import { UserResponseMapper } from "./user-response.mapper.js";
import { UserListItemMapper } from "./user-list-item.mapper.js";

export class UsersMappers {
  readonly user = new UserMapper();

  readonly credentials = new UserCredentialsMapper();

  readonly response = new UserResponseMapper();

  readonly userListItem = new UserListItemMapper();
}
