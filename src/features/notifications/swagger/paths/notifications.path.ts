import { jsonResponse, noContentResponse } from "../../../../swagger/builders/index.js";
import { forbiddenResponse, unauthorizedResponse } from "../../../../swagger/responses/index.js";
import { notificationExample, notificationsUnreadCountExample } from "../examples/index.js";
import { notificationsListExample } from "../examples/notifications-list.example.js";

export const NotificationsPaths = {
  "/notifications/": {
    get: {
      tags: ["Notifications"],

      summary: "Get all notifications",

      description: "Returns all notifications.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "type",

          in: "query",

          required: false,

          schema: {
            $ref: "#/components/schemas/NotificationType",
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
        200: jsonResponse(
          "Messages.",
          "#/components/schemas/Notification",
          notificationsListExample,
        ),

        401: unauthorizedResponse,

        403: forbiddenResponse,
      },
    },
  },

  "/notifications/unread-count": {
    get: {
      tags: ["Notifications"],

      summary: "Get unread notifications count",

      description: "Returns unread notifications count.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        200: jsonResponse(
          "Messages.",
          "#/components/schemas/NotificationsUnreadCount",
          notificationsUnreadCountExample,
        ),

        401: unauthorizedResponse,

        403: forbiddenResponse,
      },
    },
  },

  "/notifications/{id}/read": {
    post: {
      tags: ["Notifications"],

      summary: "Mark notification as read",

      description: "Marks single notification as read.",

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

          description: "Notification ID",
        },
      ],

      responses: {
        200: jsonResponse(
          "Notifications.",
          "#/components/schemas/Notification",
          notificationExample,
        ),

        401: unauthorizedResponse,

        403: forbiddenResponse,
      },
    },
  },

  "/notifications/read-all": {
    post: {
      tags: ["Notifications"],

      summary: "Mark all notifications as read",

      description: "Marks all notifications as read.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        204: noContentResponse("Marked as read"),

        401: unauthorizedResponse,

        403: forbiddenResponse,
      },
    },
  },
};
