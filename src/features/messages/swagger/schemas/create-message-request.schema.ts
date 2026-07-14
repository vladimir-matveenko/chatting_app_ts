export const CreateMessageRequestSchema = {
  CreateMessageRequest: {
    type: "object",

    required: ["type"],

    properties: {
      type: {
        $ref: "#/components/schemas/MessageType",
      },

      body: {
        type: "string",

        nullable: true,
      },

      replyToId: {
        $ref: "#/components/schemas/Id",
      },
    },
  },
};
