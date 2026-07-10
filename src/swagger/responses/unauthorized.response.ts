export const unauthorizedResponse = {
  description: "Unauthorized.",

  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/ErrorResponse",
      },
    },
  },
};
