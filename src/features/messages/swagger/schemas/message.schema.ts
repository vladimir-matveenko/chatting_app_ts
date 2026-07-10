export const MessageSchema = {
  Message: {
    type: "object",

    required: ["id", "chatId", "senderId", "type", "createdAt", "isDeleted"],

    properties: {
      id: {
        type: "string",
      },

      chatId: {
        type: "string",
      },

      senderId: {
        type: "string",
      },

      type: {
        type: "string",
        enum: ["TEXT", "IMAGE", "VIDEO", "FILE"],
      },

      body: {
        type: "string",
        nullable: true,
      },

      replyToId: {
        type: "string",
        nullable: true,
      },

      createdAt: {
        type: "string",
        format: "date-time",
      },

      editedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },

      deletedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },

      isDeleted: {
        type: "boolean",
      },
    },
  },
};
