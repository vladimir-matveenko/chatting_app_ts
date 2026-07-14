export const forbiddenResponse = {
  description: "Forbidden.",

  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/ErrorResponse",
      },
      example: {
        status: 403,

        code: "FORBIDDEN",

        message: "Forbidden.",
      },
    },
  },
};
