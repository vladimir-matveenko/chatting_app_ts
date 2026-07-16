import { createdResponse } from "../../../../swagger/builders/created-response.js";
import { noContentResponse } from "../../../../swagger/builders/no-content-response.js";
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
        204: noContentResponse,

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
        204: noContentResponse,

        401: unauthorizedResponse,
      },
    },
  },
};
