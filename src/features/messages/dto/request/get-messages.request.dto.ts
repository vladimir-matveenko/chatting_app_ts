import { MessagesMode } from "../../enums/message-mode.enum.js";

export interface GetMessagesRequestDto {
  mode: MessagesMode;

  limit: number;

  anchorMessageId?: string;

  before?: number;

  after?: number;
}
