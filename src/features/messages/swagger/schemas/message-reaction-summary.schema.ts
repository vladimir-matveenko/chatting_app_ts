export const MessageReactionSummarySchema = {
  MessageReactionSummary: {
    type: "object",

    required: ["type", "count"],

    properties: {
      type: {
        $ref: "#/components/schemas/MessageType",
      },

      count: {
        type: "integer",
      },
    },
  },
};
