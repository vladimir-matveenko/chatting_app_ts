export const ChatListItemSchema = {
  ChatListItem: {
    type: "object",

    properties: {
      id: {
        type: "string",
      },

      type: {
        type: "string",
      },

      title: {
        type: "string",

        nullable: true,
      },

      avatarUrl: {
        type: "string",

        nullable: true,
      },

      ownerId: {
        type: "string",
      },

      createdAt: {
        type: "string",

        format: "date-time",
      },

      updatedAt: {
        type: "string",

        format: "date-time",
      },

      lastMessage: {
        type: "string",

        nullable: true,
      },

      lastMessageAt: {
        type: "string",

        format: "date-time",

        nullable: true,
      },

      unreadCount: {
        type: "integer",
      },
    },
  },
};
