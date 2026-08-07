import { NotificationPayloadSchema } from "./notification-payload.schema.js";
import { NotificationTypeSchema } from "./notification-type.schema.js";
import { NotificationSchema } from "./notification.schema.js";
import { NotificationsUnreadCountSchema } from "./notifications-unread-count.schema.js";

export const notificationsSchemas = {
  ...NotificationSchema,
  ...NotificationTypeSchema,
  ...NotificationPayloadSchema,
  ...NotificationsUnreadCountSchema,
};
