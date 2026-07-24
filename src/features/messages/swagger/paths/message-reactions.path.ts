import { noContentResponse } from "../../../../swagger/builders/no-content-response.js";
import { okResponse } from "../../../../swagger/builders/ok-response.js";
import {
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  badRequestResponse,
} from "../../../../swagger/responses/index.js";

export const MessageReactionsPath = {
  "/messages/{id}/reactions": {
    post: {
      tags: ["Messages"],

      summary: "Add reaction",

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

          description: "Message ID",
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/AddReactionRequest",
            },
          },
        },
      },

      responses: {
        200: okResponse("Reaction added.", "#/components/schemas/MessageReaction"),

        400: badRequestResponse,

        401: unauthorizedResponse,

        403: forbiddenResponse,

        404: notFoundResponse,
      },
    },

    delete: {
      tags: ["Messages"],

      summary: "Remove reaction",

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

          description: "Message ID",
        },
      ],

      responses: {
        204: noContentResponse("Reaction removed."),

        401: unauthorizedResponse,

        403: forbiddenResponse,

        404: notFoundResponse,
      },
    },
  },
};
