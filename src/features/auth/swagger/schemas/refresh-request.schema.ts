export const RefreshRequest = {
  type: "object",

  required: ["refreshToken"],

  properties: {
    refreshToken: {
      type: "string",

      example: "<refresh-token>",
    },
  },
};
