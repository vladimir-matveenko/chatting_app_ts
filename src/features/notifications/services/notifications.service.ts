import { NotFoundError } from "../../../core/errors/index.js";
import { SocketEventPublisher } from "../../../core/websocket/publishers/socket-event.publisher.js";
import { NotificationType } from "../enums/notification-type.enum.js";
import { INotificationsRepository } from "../interfaces/notifications.repository.interface.js";
import { NotificationPayload } from "../models/notification-payload.model.js";
import { NotificationModel } from "../models/notification.model.js";

export class NotificationsService {
  constructor(
    private readonly repository: INotificationsRepository,
    private readonly socketPublisher: SocketEventPublisher,
  ) {}

  async create(
    userId: string,
    type: NotificationType,
    payload: NotificationPayload,
  ): Promise<NotificationModel> {
    const notification = await this.repository.create(userId, type, payload);

    this.socketPublisher.notificationCreated(notification);

    return notification;
  }

  async findAllByUser(userId: string): Promise<NotificationModel[]> {
    return this.repository.findAllByUser(userId);
  }

  async countUnread(userId: string): Promise<number> {
    return this.repository.countUnread(userId);
  }

  async markRead(notificationId: string, userId: string): Promise<NotificationModel> {
    const notification = await this.repository.markRead(userId, notificationId);

    if (!notification) {
      throw new NotFoundError("Notification not found.", "NOTIFICATION_NOT_FOUND");
    }

    return notification;
  }

  async markAllRead(userId: string): Promise<void> {
    await this.repository.markAllRead(userId);
  }
}
