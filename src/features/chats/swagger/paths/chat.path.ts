import { noContentResponse } from "../../../../swagger/builders/no-content-response.js";
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

  "/chats/{id}/archive": {
    patch: {
      tags: ["Chats"],

      summary: "Archive chat",

      description: "Archive chat by id",

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

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ArchiveChatRequest",
            },
          },
        },
      },

      responses: {
        204: noContentResponse("Chat archived."),

        401: unauthorizedResponse,
      },
    },
  },

  "/chats/{id}/mute": {
    patch: {
      tags: ["Chats"],

      summary: "Mute chat",

      description: "Mute chat for user with id",

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

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/MuteChatRequest",
            },
          },
        },
      },

      responses: {
        204: noContentResponse("Chat muted."),

        401: unauthorizedResponse,
      },
    },
  },

  "/chats/{id}/owner": {
    patch: {
      tags: ["Chats"],

      summary: "Change owner",

      description: "Change chat owner.",

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

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/TransferOwnershipRequest",
            },
          },
        },
      },

      responses: {
        204: noContentResponse("Owner changed."),

        401: unauthorizedResponse,
      },
    },
  },
};
