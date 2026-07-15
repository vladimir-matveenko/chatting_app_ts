export const UserListItemSchema = {
  UserListItem: {
    type: "object",

    required: ["id", "username"],

    properties: {
      id: {
        $ref: "#/components/schemas/Id",
      },

      username: {
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
    },
  },
};
