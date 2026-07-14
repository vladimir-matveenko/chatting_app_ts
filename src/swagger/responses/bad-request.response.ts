export const badRequestResponse = {
  description: "Bad request.",

  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/ErrorResponse",
      },
      example: {
        status: 400,

        code: "BAD_REQUEST",

        message: "Bad Request.",
      },
    },
  },
};
