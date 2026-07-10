import type { ReactionType } from "../enums/reaction-type.enum.js";

export interface MessageReaction {
  id: string;

  messageId: string;

  userId: string;

  type: ReactionType;

  createdAt: Date;
}
