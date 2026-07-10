export const UpdateMessageRequestSchema = {
  UpdateMessageRequest: {
    type: "object",

    required: ["body"],

    properties: {
      body: {
        type: "string",
        minLength: 1,
        maxLength: 5000,
      },
    },
  },
};
