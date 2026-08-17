export const resetPasswordPath = {
  "/auth/password-reset/request": {
    post: {
      tags: ["Auth"],

      security: [],

      summary: "Request password reset code",

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/RequestPasswordResetRequest",
            },
          },
        },
      },

      responses: {
        200: {
          description: "If the email exists, a reset code has been sent.",
        },
      },
    },
  },

  "/auth/password-reset/verify": {
    post: {
      tags: ["Auth"],

      security: [],

      summary: "Verify password reset code",

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/VerifyPasswordResetRequest",
            },
          },
        },
      },

      responses: {
        200: {
          description: "Reset code verified successfully.",

          content: {
            "application/json": {
              schema: {
                type: "object",

                required: ["resetToken"],

                properties: {
                  resetToken: {
                    type: "string",

                    example: "a1b2c3d4e5f6...",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  "/auth/password-reset": {
    patch: {
      tags: ["Auth"],

      security: [],

      summary: "Reset password",

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ResetPasswordRequest",
            },
          },
        },
      },

      responses: {
        204: {
          description: "Password reset successfully.",
        },
      },
    },
  },
};
