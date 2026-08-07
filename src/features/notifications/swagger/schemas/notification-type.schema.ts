export const NotificationTypeSchema = {
  NotificationType: {
    type: "string",

    enum: [
      "message",
      "chat_updated",
      "admin_granted",
      "admin_revoked",
      "member_added",
      "member_removed",
      "chat_invite",
      "owner_changed",
      "reaction",
      "reply",
    ],
  },
};
