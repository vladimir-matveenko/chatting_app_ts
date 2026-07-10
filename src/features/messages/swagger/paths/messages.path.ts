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
        201: {
          description: "Message created successfully.",

          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Message",
              },
            },
          },
        },

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
        200: {
          description: "Messages.",

          content: {
            "application/json": {
              schema: {
                type: "array",

                items: {
                  $ref: "#/components/schemas/Message",
                },
              },
            },
          },
        },

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
        200: {
          description: "Message.",

          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Message",
              },
            },
          },
        },

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
        200: {
          description: "Deleted message.",

          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Message",
              },
            },
          },
        },

        401: unauthorizedResponse,

        403: forbiddenResponse,

        404: notFoundResponse,
      },
    },
  },
};
