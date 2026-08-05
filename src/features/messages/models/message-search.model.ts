import { MessageType } from "../enums/message-type.enum.js";
import { MessageSender } from "./message-sender.model.js";

export interface MessageSearchResult {
  messageId: string;

  chatId: string;

  sender: MessageSender;

  type: MessageType;

  body: string | null;

  createdAt: Date;
}
