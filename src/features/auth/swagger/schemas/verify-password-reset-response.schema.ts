export const VerifyPasswordResetResponse = {
  type: "object",
  required: ["resetToken"],
  properties: {
    resetToken: {
      type: "string",
    },
  },
};
