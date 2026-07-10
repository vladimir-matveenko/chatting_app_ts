import type { ChatType } from "../../enums/chat-type.enum.js";

export interface CreateChatRequestDto {
  type: ChatType;

  title: string | null;

  avatarUrl: string | null;

  memberIds: string[];
}
