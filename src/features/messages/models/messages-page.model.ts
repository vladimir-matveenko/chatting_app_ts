import { Message } from "./message.model.js";

export interface MessagesPage {
  messages: Message[];

  hasPrevious: boolean;

  hasNext: boolean;
}
