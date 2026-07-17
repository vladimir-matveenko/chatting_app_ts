export const ArchiveChatRequestSchema = {
  ArchiveChatRequest: {
    type: "object",

    required: ["isArchived"],

    properties: {
      isArchived: {
        type: "boolean",
      },
    },
  },
};
