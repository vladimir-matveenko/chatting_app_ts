export const MessageReactionSchema = {
  MessageReaction: {
    type: "object",

    required: ["id", "messageId", "userId", "type", "createdAt"],

    properties: {
      id: {
        $ref: "#/components/schemas/Id",
      },

      messageId: {
        $ref: "#/components/schemas/Id",
      },

      userId: {
        $ref: "#/components/schemas/Id",
      },

      type: {
        $ref: "#/components/schemas/ReactionType",
      },

      createdAt: {
        type: "string",
        format: "date-time",
      },
    },
  },
};
