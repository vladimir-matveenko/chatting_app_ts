import { okResponse } from "../../../../swagger/builders/index.js";

export const refreshPath = {
  "/auth/refresh": {
    post: {
      tags: ["Auth"],

      security: [],

      summary: "Refresh tokens",

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              type: "object",

              required: ["refreshToken"],

              properties: {
                refreshToken: {
                  type: "string",
                },
              },
            },
          },
        },
      },

      responses: {
        200: okResponse("Tokens refreshed.", "#/components/schemas/AuthResponse"),
      },
    },
  },
};
