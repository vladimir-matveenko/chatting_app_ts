export const internalServerResponse = {
  description: "Internal server error.",

  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/ErrorResponse",
      },
      example: {
        status: 500,

        code: "INTERNAL_SERVER_ERROR",

        message: "Internal Server Error",
      },
    },
  },
};
