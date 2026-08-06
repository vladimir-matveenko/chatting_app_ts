import { NotificationType } from "../enums/notification-type.enum.js";
import { NotificationPayload } from "../models/notification-payload.model.js";
import { NotificationModel } from "../models/notification.model.js";

export interface INotificationsRepository {
  create(
    userId: string,
    type: NotificationType,
    payload: NotificationPayload,
  ): Promise<NotificationModel>;

  findById(id: string): Promise<NotificationModel | null>;

  findAllByUser(userId: string): Promise<NotificationModel[]>;

  countUnread(userId: string): Promise<number>;

  markRead(userId: string, notificationId: string): Promise<NotificationModel | null>;

  markAllRead(userId: string): Promise<void>;
}
