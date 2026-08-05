import { createdResponse } from "../../../../swagger/builders/created-response.js";
import { okResponse } from "../../../../swagger/builders/ok-response.js";
import {
  badRequestResponse,
  conflictResponse,
  unauthorizedResponse,
} from "../../../../swagger/responses/index.js";

export const ChatsPath = {
  "/chats": {
    get: {
      tags: ["Chats"],

      summary: "Get user chats",

      description: "Returns all chats of the authenticated user.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "query",

          in: "query",

          required: false,

          schema: {
            type: "string",
          },
        },

        {
          name: "limit",

          in: "query",

          required: false,

          schema: {
            type: "integer",

            minimum: 1,

            maximum: 100,

            default: 20,
          },
        },

        {
          name: "offset",

          in: "query",

          required: false,

          schema: {
            type: "integer",

            minimum: 0,

            default: 0,
          },
        },
      ],

      responses: {
        200: okResponse("User chats.", "#/components/schemas/ChatListItem"),

        401: unauthorizedResponse,
      },
    },

    post: {
      tags: ["Chats"],

      summary: "Create chat",

      description: "Creates a new private or group chat.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateChatRequest",
            },
          },
        },
      },

      responses: {
        201: createdResponse("Chat created successfully.", "#/components/schemas/Chat"),

        400: badRequestResponse,

        401: unauthorizedResponse,

        409: conflictResponse,
      },
    },
  },

  "/chats/archive": {
    get: {
      tags: ["Chats"],

      summary: "Get user archived chats",

      description: "Returns archived chats of the authenticated user.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "query",

          in: "query",

          required: false,

          schema: {
            type: "string",
          },
        },

        {
          name: "limit",

          in: "query",

          required: false,

          schema: {
            type: "integer",

            minimum: 1,

            maximum: 100,

            default: 20,
          },
        },

        {
          name: "offset",

          in: "query",

          required: false,

          schema: {
            type: "integer",

            minimum: 0,

            default: 0,
          },
        },
      ],

      responses: {
        200: okResponse("User chats.", "#/components/schemas/ChatListItem"),

        401: unauthorizedResponse,
      },
    },
  },
};
