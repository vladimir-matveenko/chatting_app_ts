export const AddReactionRequestSchema = {
  AddReactionRequest: {
    type: "object",

    required: ["type"],

    properties: {
      type: {
        type: "string",
        enum: ["LIKE", "DISLIKE"],
      },
    },
  },
};
