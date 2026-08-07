import { NotificationType } from "../enums/notification-type.enum.js";
import { NotificationPayload } from "../models/notification-payload.model.js";

export interface NotificationEntity {
  id: string;

  user_id: string;

  type: NotificationType;

  payload: NotificationPayload;

  is_read: boolean;

  created_at: Date;

  read_at: Date | null;
}
