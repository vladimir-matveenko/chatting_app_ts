export const ChatSchema = {
  Chat: {
    type: "object",

    required: ["id", "type", "ownerId", "createdAt", "updatedAt"],

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
    },
  },
};
