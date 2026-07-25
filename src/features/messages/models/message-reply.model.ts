import type { MessageType } from "../enums/message-type.enum.js";
import type { MessageSender } from "./message-sender.model.js";

export interface MessageReply {
  id: string;

  sender: MessageSender;

  type: MessageType;

  body: string | null;

  deletedAt: Date | null;
}
