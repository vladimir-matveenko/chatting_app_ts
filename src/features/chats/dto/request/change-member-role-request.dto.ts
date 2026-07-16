import { ChatMemberRole } from "../../enums/chat-member-role.enum.js";

export interface ChangeMemberRoleRequestDto {
  role: ChatMemberRole;
}
