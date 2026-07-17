import { ChatSchema } from "./chat.schema.js";

import { ChatListItemSchema } from "./chat-list-item.schema.js";

import { CreateChatRequestSchema } from "./create-chat-request.schema.js";
import { ChatTypeSchema } from "./chat-type.schema.js";
import { ChatMemberRoleSchema } from "./chat-member-role.schema.js";
import { ChatMemberSchema } from "./chat-member.schema.js";
import { ChatListParticipantSchema } from "./chat-list-participant.schema.js";
import { ArchiveChatRequestSchema } from "./archive-chat-request.schema.js";
import { MuteChatRequestSchema } from "./mute-chat-request.schema.js";
import { AddChatMemberRequestSchema } from "./add-chat-member-request.schema.js";
import { ChangeMemberRoleRequestSchema } from "./change-member-role-request.schema.js";
import { TransferOwnershipRequestSchema } from "./transfer-ownership-request.schema.js";
import { UpdateChatRequestSchema } from "./update-chat-request.schema.js";

export const chatsSchemas = {
  ...ChatSchema,

  ...MuteChatRequestSchema,

  ...ChatListItemSchema,

  ...CreateChatRequestSchema,

  ...ArchiveChatRequestSchema,

  ...UpdateChatRequestSchema,

  ...AddChatMemberRequestSchema,

  ...ChangeMemberRoleRequestSchema,

  ...TransferOwnershipRequestSchema,

  ...ChatTypeSchema,

  ...ChatMemberSchema,

  ...ChatMemberRoleSchema,

  ...ChatListParticipantSchema,
};
