export const validationResponse = {
  description: "Validation failed.",

  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/ErrorResponse",
      },
    },
  },
};
