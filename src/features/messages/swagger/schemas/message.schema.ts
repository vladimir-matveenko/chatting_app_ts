export const MessageSchema = {
  Message: {
    type: "object",

    required: ["id", "chatId", "sender", "type", "createdAt", "isDeleted", "reactions"],

    properties: {
      id: {
        $ref: "#/components/schemas/Id",
      },

      chatId: {
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

      replyToId: {
        $ref: "#/components/schemas/Id",
      },

      createdAt: {
        type: "string",

        format: "date-time",
      },

      updatedAt: {
        type: "string",

        format: "date-time",
      },

      deletedAt: {
        type: "string",

        format: "date-time",

        nullable: true,
      },

      isDeleted: {
        type: "boolean",
      },

      reply: {
        allOf: [
          {
            $ref: "#/components/schemas/MessageReply",
          },
        ],
      },

      reactions: {
        type: "array",

        items: {
          $ref: "#/components/schemas/MessageReactionSummary",
        },
      },

      currentUserReaction: {
        allOf: [
          {
            $ref: "#/components/schemas/ReactionType",
          },
        ],

        nullable: true,
      },
    },
  },
};
