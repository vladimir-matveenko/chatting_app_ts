import {
  badRequestResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../../../swagger/responses/index.js";

export const ChatMembersPath = {
  "/chats/{id}/members": {
    get: {
      tags: ["Chats"],

      summary: "Get chat members",

      description: "Returns all members of the specified chat.",

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
          description: "Chat members.",

          content: {
            "application/json": {
              schema: {
                type: "array",

                items: {
                  $ref: "#/components/schemas/ChatMember",
                },
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
