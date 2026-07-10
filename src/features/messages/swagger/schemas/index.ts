import { MessageSchema } from "./message.schema.js";

import { CreateMessageRequestSchema } from "./create-message-request.schema.js";

import { UpdateMessageRequestSchema } from "./update-message-request.schema.js";

import { MessageReactionSchema } from "./message-reaction.schema.js";

import { AddReactionRequestSchema } from "./add-reaction-request.schema.js";

export const messagesSchemas = {
  ...MessageSchema,

  ...CreateMessageRequestSchema,

  ...UpdateMessageRequestSchema,

  ...MessageReactionSchema,

  ...AddReactionRequestSchema,
};
