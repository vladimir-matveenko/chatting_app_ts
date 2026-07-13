export const CreateMessageRequestSchema = {
  CreateMessageRequest: {
    type: "object",

    required: ["type"],

    properties: {
      type: {
        type: "string",

        enum: ["text", "image", "video", "audio", "file", "system"],
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
