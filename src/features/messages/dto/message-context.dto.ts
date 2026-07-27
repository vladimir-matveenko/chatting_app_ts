import { Message } from "../models/message.model.js";

export interface MessageContext {
  targetMessageId: string;

  hasPrevious: boolean;

  hasNext: boolean;

  messages: Message[];
}
