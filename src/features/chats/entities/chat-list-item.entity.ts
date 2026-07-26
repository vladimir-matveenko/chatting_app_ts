import { MessageType } from "../../messages/enums/message-type.enum.js";
import { ChatType } from "../enums/chat-type.enum.js";
import { ChatListParticipant } from "../models/chat-list-participant.model.js";

export interface ChatListItemEntity {
  id: string;

  type: ChatType;

  title: string | null;

  avatar_url: string | null;

  owner_id: string | null;

  created_at: Date;

  updated_at: Date;

  last_message_id: string | null;

  last_message_body: string | null;

  last_message_at: Date | null;

  last_message_type: MessageType | null;

  unread_count: number;

  last_read_message_id: string | null;

  participants: ChatListParticipant[];

  participants_count: number;
}
