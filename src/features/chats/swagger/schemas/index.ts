import { ChatSchema } from "./chat.schema.js";

import { ChatListItemSchema } from "./chat-list-item.schema.js";

import { CreateChatRequestSchema } from "./create-chat-request.schema.js";
import { ChatTypeSchema } from "./chat-type.schema.js";
import { ChatMemberRoleSchema } from "./chat-member-role.schema.js";
import { ChatMemberSchema } from "./chat-member.schema.js";

export const chatsSchemas = {
  ...ChatSchema,

  ...ChatListItemSchema,

  ...CreateChatRequestSchema,

  ...ChatTypeSchema,

  ...ChatMemberSchema,

  ...ChatMemberRoleSchema,
};
