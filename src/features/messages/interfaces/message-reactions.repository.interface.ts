import type { AddReactionDto } from "../dto/add-reaction.dto.js";

import type { MessageReaction } from "../models/message-reaction.model.js";

import type { ReactionType } from "../enums/reaction-type.enum.js";

export interface IMessageReactionsRepository {
  add(dto: AddReactionDto): Promise<MessageReaction>;

  findByMessageAndUser(
    messageId: string,

    userId: string,
  ): Promise<MessageReaction | null>;

  update(
    reactionId: string,

    type: ReactionType,
  ): Promise<MessageReaction>;

  delete(reactionId: string): Promise<void>;
}
