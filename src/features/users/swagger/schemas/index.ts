import { UserSchema } from "./user.schema.js";

import { UpdateUserRequestSchema } from "./update-user-request.schema.js";

import { UpdatePasswordRequest } from "./update-password-request.schema.js";

import { UserListItemSchema } from "./user-list-item.schema.js";

export const usersSchemas = {
  ...UserSchema,

  ...UpdateUserRequestSchema,

  ...UpdatePasswordRequest,

  ...UserListItemSchema,
};
