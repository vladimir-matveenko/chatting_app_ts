import { ChatMemberRole } from "../enums/chat-member-role.enum.js";

export const EditChatPermissions: ReadonlySet<ChatMemberRole> = new Set([
  ChatMemberRole.OWNER,

  ChatMemberRole.ADMIN,
]);
