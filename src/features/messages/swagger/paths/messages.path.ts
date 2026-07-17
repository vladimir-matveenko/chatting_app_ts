import { createdResponse } from "../../../../swagger/builders/created-response.js";
import { okResponse } from "../../../../swagger/builders/ok-response.js";
import {
  badRequestResponse,
  forbiddenResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../../../swagger/responses/index.js";

export const MessagesPaths = {
  "/messages/chat/{id}": {
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
          name: "id",

          in: "path",

          required: true,

          schema: {
            type: "string",
          },
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
        200: okResponse("Messages.", "#/components/schemas/Message"),

        401: unauthorizedResponse,

        403: forbiddenResponse,

        404: notFoundResponse,
      },
    },
  },

  "/messages/{id}": {
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
          name: "id",

          in: "path",

          required: true,

          schema: {
            type: "string",
          },
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
          name: "id",

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
};
