import { createdResponse } from "../../../../swagger/builders/created-response.js";
import { noContentResponse } from "../../../../swagger/builders/no-content-response.js";
import { okResponse } from "../../../../swagger/builders/ok-response.js";
import { jsonResponse } from "../../../../swagger/builders/response.builder.js";
import {
  badRequestResponse,
  forbiddenResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../../../swagger/responses/index.js";

import { messagesListExample } from "../examples/messages-list.example.js";

export const MessagesPaths = {
  "/messages/chat/{chatId}": {
    post: {
      tags: ["Messages"],

      summary: "Send message",

      description: "Creates a new message in the specified chat.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "chatId",

          in: "path",

          required: true,

          schema: {
            type: "string",
          },

          description: "Chat ID",
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateMessageRequest",
            },
          },
        },
      },

      responses: {
        201: createdResponse("Message created successfully.", "#/components/schemas/Message"),

        400: badRequestResponse,

        401: unauthorizedResponse,

        403: forbiddenResponse,

        404: notFoundResponse,
      },
    },

    get: {
      tags: ["Messages"],

      summary: "Get chat messages",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "chatId",

          in: "path",

          required: true,

          schema: {
            type: "string",
          },

          description: "Chat ID",
        },

        {
          name: "limit",

          in: "query",

          schema: {
            type: "integer",

            default: 50,
          },
        },

        {
          name: "before",

          in: "query",

          schema: {
            type: "string",
          },
        },
      ],

      responses: {
        200: jsonResponse("Messages.", "#/components/schemas/Message", messagesListExample),

        401: unauthorizedResponse,

        403: forbiddenResponse,

        404: notFoundResponse,
      },
    },
  },

  "/messages/{messageId}": {
    get: {
      tags: ["Messages"],

      summary: "Get message",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "messageId",

          in: "path",

          required: true,

          schema: {
            type: "string",
          },

          description: "Message ID",
        },
      ],

      responses: {
        200: okResponse("Message.", "#/components/schemas/Message"),

        401: unauthorizedResponse,

        403: forbiddenResponse,

        404: notFoundResponse,
      },
    },

    patch: {
      tags: ["Messages"],

      summary: "Update message",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "messageId",

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
              $ref: "#/components/schemas/UpdateMessageRequest",
            },
          },
        },
      },

      responses: {
        200: okResponse("Message.", "#/components/schemas/Message"),

        401: unauthorizedResponse,

        403: forbiddenResponse,

        404: notFoundResponse,
      },
    },

    delete: {
      tags: ["Messages"],

      summary: "Delete message",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "messageId",

          in: "path",

          required: true,

          schema: {
            type: "string",
          },
        },
      ],

      responses: {
        200: okResponse("Deleted message.", "#/components/schemas/Message"),

        401: unauthorizedResponse,

        403: forbiddenResponse,

        404: notFoundResponse,
      },
    },
  },

  "/messages/chat/{chatId}/pinned": {
    get: {
      tags: ["Messages"],

      summary: "Get pinned messages",

      description: "Get pinned messages for the chat.",

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

          description: "Chat ID",
        },
      ],

      responses: {
        200: jsonResponse("Messages.", "#/components/schemas/Message", messagesListExample),

        401: unauthorizedResponse,
      },
    },
  },

  "/messages/{messageId}/pin": {
    put: {
      tags: ["Messages"],

      summary: "Pin the message",

      description: "Pin the message.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "messageId",

          in: "path",

          required: true,

          schema: {
            type: "string",
          },

          description: "Message ID",
        },
      ],

      responses: {
        200: okResponse("Message pinned.", "#/components/schemas/Message"),

        401: unauthorizedResponse,
      },
    },
    delete: {
      tags: ["Messages"],

      summary: "Unpin the message",

      description: "Unpin the message.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "messageId",

          in: "path",

          required: true,

          schema: {
            type: "string",
          },

          description: "Message ID",
        },
      ],

      responses: {
        200: okResponse("Message unpinned.", "#/components/schemas/Message"),

        401: unauthorizedResponse,
      },
    },
  },

  "/messages/{id}/read": {
    post: {
      tags: ["Messages"],

      summary: "Mark message as read",

      description: "Mark message as read. You can use websockets instead of this request",

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
        204: noContentResponse("Message marked as read"),

        401: unauthorizedResponse,

        404: notFoundResponse,
      },
    },
  },
};
