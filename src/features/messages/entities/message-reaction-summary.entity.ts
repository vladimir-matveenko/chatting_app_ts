import { ReactionType } from "../enums/reaction-type.enum.js";

export interface MessageReactionSummaryEntity {
  type: ReactionType;

  count: number;

  reacted: boolean;
}
