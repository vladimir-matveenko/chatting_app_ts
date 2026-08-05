export const MessagePageSchema = {
  MessagesPage: {
    type: "object",

    required: ["hasPrevious", "hasNext", "messages"],

    properties: {
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
