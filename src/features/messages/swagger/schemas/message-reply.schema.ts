export const MessageReplySchema = {
  MessageReply: {
    type: "object",

    required: ["id", "senderId", "type"],

    properties: {
      id: {
        $ref: "#/components/schemas/Id",
      },

      sender: {
        $ref: "#/components/schemas/MessageSender",
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
