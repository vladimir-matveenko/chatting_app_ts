import type { MessageType } from "../enums/message-type.enum.js";
import { ReactionType } from "../enums/reaction-type.enum.js";
import { MessageReactionSummary } from "../models/message-reaction-summary.model.js";

export interface MessageEntity {
  id: string;

  chat_id: string;

  sender_id: string;

  sender_user_name: string;

  sender_display_name: string | null;

  sender_avatar_url: string | null;

  type: MessageType;

  body: string | null;

  reply_to_id: string | null;

  deleted_at: Date | null;

  created_at: Date;

  updated_at: Date;

  is_deleted: boolean;

  reply_id: string | null;

  reply_sender_id: string | null;

  reply_sender_user_name: string | null;

  reply_sender_display_name: string | null;

  reply_sender_avatar_url: string | null;

  reply_body: string | null;

  reply_type: MessageType | null;

  reply_deleted_at: Date | null;

  reactions: MessageReactionSummary[];

  current_user_reaction: ReactionType | null;

  read_count: number;
}
