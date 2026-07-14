import { authSchemas } from "../features/auth/swagger/index.js";

import { usersSchemas } from "../features/users/swagger/index.js";

import { chatsSchemas } from "../features/chats/swagger/index.js";

import { messagesSchemas } from "../features/messages/swagger/index.js";
import { idSchema } from "./schemas/id.schema.js";
import { errorSchemas } from "./schemas/error.schema.js";

export const schemas = {
  ...errorSchemas,

  ...idSchema,

  ...authSchemas,

  ...usersSchemas,

  ...chatsSchemas,

  ...messagesSchemas,
};
