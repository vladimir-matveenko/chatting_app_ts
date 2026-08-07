export const NotificationsUnreadCountSchema = {
  NotificationsUnreadCount: {
    type: "object",

    required: ["unreadCount"],

    properties: {
      unreadCount: {
        type: "integer",
      },
    },
  },
};
