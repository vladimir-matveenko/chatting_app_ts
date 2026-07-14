export const ChatMemberSchema = {
  ChatMember: {
    type: "object",

    properties: {
      chatId: {
        $ref: "#/components/schemas/Id",
      },

      userId: {
        $ref: "#/components/schemas/Id",
      },

      role: {
        $ref: "#/components/schemas/ChatMemberRole",
      },

      joinedAt: {
        type: "string",

        format: "date-time",
      },

      lastReadMessageId: {
        $ref: "#/components/schemas/Id",
      },

      isMuted: {
        type: "boolean",
      },

      isArchived: {
        type: "boolean",
      },
    },
  },
};
