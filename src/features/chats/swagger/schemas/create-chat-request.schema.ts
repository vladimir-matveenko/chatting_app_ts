export const CreateChatRequestSchema = {
  CreateChatRequest: {
    type: "object",

    required: ["type", "memberIds"],

    properties: {
      type: {
        $ref: "#/components/schemas/ChatType",
      },

      title: {
        type: "string",

        nullable: true,
      },

      avatarUrl: {
        type: "string",

        format: "uri",

        nullable: true,
      },

      memberIds: {
        type: "array",

        items: {
          $ref: "#/components/schemas/Id",
        },
      },
    },
  },
};
