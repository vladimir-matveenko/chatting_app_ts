import { NotificationType } from "../enums/notification-type.enum.js";
import { NotificationPayload } from "../models/notification-payload.model.js";

export interface NotificationEntity {
  id: string;

  userId: string;

  type: NotificationType;

  payload: NotificationPayload;

  isRead: boolean;

  createdAt: Date;

  readAt: Date | null;
}
