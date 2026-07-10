import type { ReactionType } from "../../enums/reaction-type.enum.js";

export interface AddReactionRequestDto {
  type: ReactionType;
}
