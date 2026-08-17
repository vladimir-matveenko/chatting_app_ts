export const VerifyPasswordResetRequest = {
  type: "object",
  required: ["email", "code"],
  properties: {
    email: {
      type: "string",
      format: "email",
    },
    code: {
      type: "string",
      pattern: "^\\d{6}$",
    },
  },
};
