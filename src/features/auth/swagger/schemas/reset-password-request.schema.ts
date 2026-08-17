export const ResetPasswordRequest = {
  type: "object",
  required: ["resetToken", "password"],
  properties: {
    resetToken: {
      type: "string",
    },
    password: {
      type: "string",
      format: "password",
    },
  },
};
