export const UpdateChatRequestSchema = {
  UpdateChatRequest: {
    type: "object",

    properties: {
      title: {
        type: "string",

        nullable: true,
      },

      avatarUrl: {
        type: "string",

        format: "uri",

        nullable: true,
      },
    },
  },
};
