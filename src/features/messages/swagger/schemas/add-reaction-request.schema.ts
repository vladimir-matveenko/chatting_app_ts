export const AddReactionRequestSchema = {
  AddReactionRequest: {
    type: "object",

    required: ["type"],

    properties: {
      type: {
        $ref: "#/components/schemas/ReactionType",
      },
    },
  },
};
