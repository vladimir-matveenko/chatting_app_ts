export const notFoundResponse = {
  description: "Resource not found.",

  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/ErrorResponse",
      },
      example: {
        status: 404,

        code: "NOT_FOUND",

        message: "Not found.",
      },
    },
  },
};
