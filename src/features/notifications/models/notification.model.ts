import { NotificationType } from "../enums/notification-type.enum.js";
import { NotificationPayload } from "./notification-payload.model.js";

export interface NotificationModel {
  id: string;

  userId: string;

  type: NotificationType;

  payload: NotificationPayload;

  isRead: boolean;

  createdAt: Date;

  readAt: Date | null;
}
