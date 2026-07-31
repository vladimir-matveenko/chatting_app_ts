import { MessageEntity } from "./message.entity.js";

export interface MessagesPageEntity {
  messages: MessageEntity[];

  has_previous: boolean;

  has_next: boolean;
}
