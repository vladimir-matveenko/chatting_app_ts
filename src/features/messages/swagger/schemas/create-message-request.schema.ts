export const CreateMessageRequestSchema = {
  CreateMessageRequest: {
    type: "object",

    required: ["type"],

    properties: {
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
    },
  },
};
