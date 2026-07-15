import { jsonResponse } from "../../../../swagger/builders/index.js";
import { unauthorizedResponse } from "../../../../swagger/responses/index.js";

import { userListExample } from "../examples/index.js";

export const getUsersPath = {
  "/users": {
    get: {
      tags: ["Users"],

      summary: "Search users",

      description: "Returns users by search query.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "q",

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
        200: jsonResponse("Users list.", "#/components/schemas/UserListItem", userListExample),

        401: unauthorizedResponse,
      },
    },
  },
};
