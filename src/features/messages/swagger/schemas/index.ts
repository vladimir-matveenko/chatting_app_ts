import { MessageSchema } from "./message.schema.js";

import { CreateMessageRequestSchema } from "./create-message-request.schema.js";

import { UpdateMessageRequestSchema } from "./update-message-request.schema.js";

import { MessageReactionSchema } from "./message-reaction.schema.js";

import { AddReactionRequestSchema } from "./add-reaction-request.schema.js";
import { MessageReplySchema } from "./message-reply.schema.js";
import { MessageReactionSummarySchema } from "./message-reaction-summary.schema.js";
import { ReactionTypeSchema } from "./reaction-type.schema.js";
import { MessageTypeSchema } from "./message-type.schema.js";
import { MessageSenderSchema } from "./message-sender.schema.js";
import { MessagePageSchema } from "./message-page.schema.js";

export const messagesSchemas = {
  ...MessageSchema,

  ...CreateMessageRequestSchema,

  ...UpdateMessageRequestSchema,

  ...MessageReactionSchema,

  ...AddReactionRequestSchema,

  ...MessageReactionSchema,

  ...MessageReplySchema,

  ...MessageReactionSummarySchema,

  ...ReactionTypeSchema,

  ...MessageTypeSchema,

  ...MessageSenderSchema,

  ...MessagePageSchema,
};
