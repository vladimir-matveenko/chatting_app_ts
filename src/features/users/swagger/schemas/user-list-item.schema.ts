export const UserListItemSchema = {
  UserListItem: {
    type: "object",

    required: ["id", "userName"],

    properties: {
      id: {
        $ref: "#/components/schemas/Id",
      },

      userName: {
        type: "string",
      },

      displayName: {
        type: "string",

        nullable: true,
      },

      avatarUrl: {
        type: "string",

        nullable: true,
      },

      privateChatId: {
        allOf: [
          {
            $ref: "#/components/schemas/Id",
          },
        ],

        nullable: true,
      },
    },
  },
};
