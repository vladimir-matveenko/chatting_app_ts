export const UpdateUserRequestSchema = {
  UpdateUserRequest: {
    type: "object",

    properties: {
      username: {
        type: "string",

        example: "john_new",
      },

      displayName: {
        type: "string",

        example: "John Smith",
      },

      avatarUrl: {
        type: "string",

        example: "https://example.com/avatar.png",
      },

      email: {
        type: "string",

        format: "email",

        example: "john@example.com",
      },
    },
  },
};
