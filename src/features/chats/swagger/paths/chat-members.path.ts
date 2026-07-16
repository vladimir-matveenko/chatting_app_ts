import { noContentResponse } from "../../../../swagger/builders/index.js";
import { okResponse } from "../../../../swagger/builders/ok-response.js";
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
        200: okResponse("Chat members.", "#/components/schemas/ChatMember"),

        400: badRequestResponse,

        401: unauthorizedResponse,

        404: notFoundResponse,
      },
    },
  },

  "/chats/{id}/members/me": {
    delete: {
      tags: ["Chats"],

      summary: "Remove current user from chat",

      description: "Remove current user from chat",

      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        204: noContentResponse("You left chat."),

        401: unauthorizedResponse,
      },
    },
  },

  "/chats/{id}/members/": {
    post: {
      tags: ["Chats"],

      summary: "Add member to chat",

      description: "Add member to chat",

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
              $ref: "#/components/schemas/AddChatMemberRequest",
            },
          },
        },
      },

      responses: {
        204: noContentResponse("Members added."),

        401: unauthorizedResponse,
      },
    },
  },

  "/chats/{id}/members/{userId}": {
    delete: {
      tags: ["Chats"],

      summary: "Delete member from chat",

      description: "Delete member from chat",

      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        204: noContentResponse("Member deleted."),

        401: unauthorizedResponse,
      },
    },
  },

  "/chats/{id}/members/{userId}/role": {
    patch: {
      tags: ["Chats"],

      summary: "Change member role",

      description: "Change member role",

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
              $ref: "#/components/schemas/ChangeMemberRoleRequest",
            },
          },
        },
      },

      responses: {
        204: noContentResponse("Role updated."),

        401: unauthorizedResponse,
      },
    },
  },
};
