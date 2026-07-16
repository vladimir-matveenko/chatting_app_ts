import { ChatMemberRole } from "../enums/chat-member-role.enum.js";

export const ManageMembersPermissions: Record<ChatMemberRole, readonly ChatMemberRole[]> = {
  [ChatMemberRole.OWNER]: [ChatMemberRole.ADMIN, ChatMemberRole.MEMBER],

  [ChatMemberRole.ADMIN]: [ChatMemberRole.MEMBER],

  [ChatMemberRole.MEMBER]: [],
};
