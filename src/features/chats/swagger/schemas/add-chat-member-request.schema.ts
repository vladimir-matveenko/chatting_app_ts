export const AddChatMemberRequestSchema = {
  AddChatMemberRequest: {
    type: "object",

    required: ["memberIds"],

    properties: {
      memberIds: {
        type: "array",

        items: {
          $ref: "#/components/schemas/Id",
        },
      },
    },
  },
};
