import type { ReactionType } from "../enums/reaction-type.enum.js";

export interface AddReactionDto {
  messageId: string;

  userId: string;

  type: ReactionType;
}
