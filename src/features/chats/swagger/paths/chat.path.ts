import { okResponse } from "../../../../swagger/builders/ok-response.js";
import {
  badRequestResponse,
  forbiddenResponse,
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
        200: okResponse("Chat.", "#/components/schemas/Chat"),

        400: badRequestResponse,

        401: unauthorizedResponse,

        403: forbiddenResponse,

        404: notFoundResponse,
      },
    },
  },
};
