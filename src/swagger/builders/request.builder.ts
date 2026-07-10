export function jsonRequest(
  schemaRef: string,

  example?: unknown,

  required = true,
) {
  return {
    required,

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
