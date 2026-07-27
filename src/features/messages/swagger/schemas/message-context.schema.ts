export const MessageContextSchema = {
  MessageContext: {
    type: "object",

    required: ["targetMessageId", "hasPrevious", "hasNext", "messages"],

    properties: {
      targetMessageId: {
        $ref: "#/components/schemas/Id",
      },

      hasPrevious: {
        type: "boolean",
      },

      hasNext: {
        type: "boolean",
      },

      messages: {
        type: "array",

        items: {
          $ref: "#/components/schemas/Message",
        },
      },
    },
  },
};
