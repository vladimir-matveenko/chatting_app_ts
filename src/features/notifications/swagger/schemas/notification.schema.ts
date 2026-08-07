export const NotificationSchema = {
  Notification: {
    type: "object",

    required: ["id", "userId", "type", "payload", "isRead", "createdAt"],

    properties: {
      id: {
        $ref: "#/components/schemas/Id",
      },

      userId: {
        $ref: "#/components/schemas/Id",
      },

      type: {
        $ref: "#/components/schemas/NotificationType",
      },

      payload: {
        $ref: "#/components/schemas/NotificationPayload",
      },

      isRead: {
        type: "boolean",
      },

      createdAt: {
        type: "string",

        format: "date-time",
      },

      readAt: {
        type: "string",

        format: "date-time",

        nullable: true,
      },
    },
  },
};
