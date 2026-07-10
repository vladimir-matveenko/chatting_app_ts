export const MessageReactionSchema = {
  MessageReaction: {
    type: "object",

    required: ["id", "messageId", "userId", "type", "createdAt"],

    properties: {
      id: {
        type: "string",
      },

      messageId: {
        type: "string",
      },

      userId: {
        type: "string",
      },

      type: {
        type: "string",
        enum: ["LIKE", "DISLIKE"],
      },

      createdAt: {
        type: "string",
        format: "date-time",
      },
    },
  },
};
