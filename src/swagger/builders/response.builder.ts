export function jsonResponse(
  description: string,

  schemaRef: string,

  example?: Record<string, unknown>,
) {
  return {
    description,

    content: {
      "application/json": {
        schema: {
          $ref: schemaRef,
        },

        ...(example ? { example } : {}),
      },
    },
  };
}
