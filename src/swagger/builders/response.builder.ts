export function jsonResponse(
  description: string,

  schemaRef: string,

  example?: unknown,
) {
  return {
    description,

    content: {
      "application/json": {
        schema: {
          $ref: schemaRef,
        },

        ...(example !== undefined ? { example } : {}),
      },
    },
  };
}
