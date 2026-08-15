export const UpdateUserRequestSchema = {
  UpdateUserRequest: {
    type: "object",

    properties: {
      userName: {
        type: "string",

        example: "john_new",
      },

      displayName: {
        type: "string",

        example: "John Smith",
      },

      email: {
        type: "string",

        format: "email",

        example: "john@example.com",
      },
    },
  },
};
