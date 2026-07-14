export const ChatListItemSchema = {
  ChatListItem: {
    type: "object",

    required: [
      "id",
      "type",
      "ownerId",
      "createdAt",
      "updatedAt",
      "unreadCount",
      "participants",
      "participantsCount",
    ],

    properties: {
      id: {
        $ref: "#/components/schemas/Id",
      },

      type: {
        $ref: "#/components/schemas/ChatType",
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

      participants: {
        type: "array",
        items: {
          $ref: "#/components/schemas/ChatListParticipant",
        },
      },

      participantsCount: {
        type: "integer",
      },
    },
  },
};
