import { authSchemas } from "../features/auth/swagger/index.js";

import { usersSchemas } from "../features/users/swagger/index.js";

import { errorSchemas } from "./schemas/index.js";

import { chatsSchemas } from "../features/chats/swagger/index.js";

import { messagesSchemas } from "../features/messages/swagger/index.js";

export const schemas = {
  ...errorSchemas,

  ...authSchemas,

  ...usersSchemas,

  ...chatsSchemas,

  ...messagesSchemas,
};
