import {
  badRequestResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../../../swagger/responses/index.js";

export const ChatPath = {
  "/chats/{id}": {
    get: {
      tags: ["Chats"],

      summary: "Get chat",

      description: "Returns chat by id.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "id",

          in: "path",

          required: true,

          schema: {
            type: "string",
          },
        },
      ],

      responses: {
        200: {
          description: "Chat.",

          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Chat",
              },
            },
          },
        },

        400: badRequestResponse,

        401: unauthorizedResponse,

        404: notFoundResponse,
      },
    },
  },
};
