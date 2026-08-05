export const MessageSearchResultSchema = {
  MessageSearchResult: {
    type: "object",

    required: ["id", "chatId", "sender", "type", "createdAt", "isDeleted", "reactions"],

    properties: {
      messageId: {
        $ref: "#/components/schemas/Id",
      },

      chatId: {
        $ref: "#/components/schemas/Id",
      },

      type: {
        $ref: "#/components/schemas/MessageType",
      },

      sender: {
        $ref: "#/components/schemas/MessageSender",
      },

      body: {
        type: "string",

        nullable: true,
      },

      createdAt: {
        type: "string",

        format: "date-time",
      },
    },
  },
};
