export const MessageReplySchema = {
  MessageReply: {
    type: "object",

    required: ["id", "senderId", "type"],

    properties: {
      id: {
        $ref: "#/components/schemas/Id",
      },

      senderId: {
        $ref: "#/components/schemas/Id",
      },

      type: {
        $ref: "#/components/schemas/MessageType",
      },

      body: {
        type: "string",

        nullable: true,
      },

      deletedAt: {
        type: "string",

        format: "date-time",

        nullable: true,
      },
    },
  },
};
