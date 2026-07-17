export const MuteChatRequestSchema = {
  MuteChatRequest: {
    type: "object",

    required: ["isMuted"],

    properties: {
      isMuted: {
        type: "boolean",
      },
    },
  },
};
