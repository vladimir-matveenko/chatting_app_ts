import { ReactionType } from "../enums/reaction-type.enum.js";

export interface MessageReactionSummary {
  type: ReactionType;

  count: number;

  reacted: boolean;
}
