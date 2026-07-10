import type { ReactionType } from "../enums/reaction-type.enum.js";

export interface MessageReactionEntity {
  id: string;

  message_id: string;

  user_id: string;

  type: ReactionType;

  created_at: Date;
}
