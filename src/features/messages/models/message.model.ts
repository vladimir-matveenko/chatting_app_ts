import type { MessageType } from "../enums/message-type.enum.js";
import { ReactionType } from "../enums/reaction-type.enum.js";
import { MessageReactionSummary } from "./message-reaction-summary.model.js";

import type { MessageReply } from "./message-reply.model.js";
import { MessageSender } from "./message-sender.model.js";

export interface Message {
  id: string;

  chatId: string;

  sender: MessageSender;

  type: MessageType;

  body: string | null;

  replyToId: string | null;

  deletedAt: Date | null;

  createdAt: Date;

  updatedAt: Date;

  isDeleted: boolean;

  reply: MessageReply | null;

  reactions: MessageReactionSummary[];

  currentUserReaction: ReactionType | null;
}
