export const conflictResponse = {
  description: "Conflict.",

  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/ErrorResponse",
      },
      example: {
        status: 409,

        code: "CONFLICT",

        message: "Conflict.",
      },
    },
  },
};
