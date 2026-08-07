export const NotificationTypeSchema = {
  NotificationType: {
    type: "string",

    enum: [
      "MESSAGE",
      "CHAT_UPDATED",
      "ADMIN_GRANTED",
      "ADMIN_REVOKED",
      "MEMBER_ADDED",
      "MEMBER_REMOVED",
      "CHAT_INVITE",
      "OWNER_CHANGED",
      "REACTION",
      "REPLY",
    ],
  },
};
