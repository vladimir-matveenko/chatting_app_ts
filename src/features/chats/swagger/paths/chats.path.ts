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
};
