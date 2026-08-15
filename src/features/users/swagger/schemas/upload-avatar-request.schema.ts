export const UploadAvatarRequestSchema = {
  UploadAvatarRequest: {
    type: "object",

    required: ["file"],

    properties: {
      file: {
        type: "string",

        format: "binary",
      },
    },
  },
};
