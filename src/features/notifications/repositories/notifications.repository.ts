import { BaseRepository } from "../../../core/database/base.repository.js";
import { Database } from "../../../core/database/database.js";
import { NotificationEntity } from "../entities/notification.entity.js";
import { NotificationType } from "../enums/notification-type.enum.js";
import { INotificationsRepository } from "../interfaces/notifications.repository.interface.js";
import { NotificationMapper } from "../mappers/notification.mapper.js";
import { NotificationPayload } from "../models/notification-payload.model.js";
import { NotificationModel } from "../models/notification.model.js";
import { NotificationsQueries } from "../queries/notifications.queries.js";

export class NotificationsRepository
  extends BaseRepository<NotificationEntity, NotificationModel>
  implements INotificationsRepository
{
  constructor(db: Database) {
    super(db, new NotificationMapper());
  }

  async create(
    userId: string,
    type: NotificationType,
    payload: NotificationPayload,
  ): Promise<NotificationModel> {
    return this.saveOne(NotificationsQueries.CREATE, [userId, type, payload]);
  }

  async findById(id: string): Promise<NotificationModel | null> {
    return this.findOne(NotificationsQueries.FIND_BY_ID, [id]);
  }

  async findAllByUser(userId: string): Promise<NotificationModel[]> {
    return this.findMany(NotificationsQueries.FIND_ALL_BY_USER, [userId]);
  }

  async countUnread(userId: string): Promise<number> {
    const result = await this.db.query<{ count: number }>(NotificationsQueries.COUNT_UNREAD, [
      userId,
    ]);

    return result.rows[0]?.count ?? 0;
  }

  async markRead(userId: string, notificationId: string): Promise<NotificationModel | null> {
    return this.findOne(NotificationsQueries.MARK_READ, [userId, notificationId]);
  }

  async markAllRead(userId: string): Promise<void> {
    await this.query(NotificationsQueries.MARK_ALL_READ, [userId]);
  }
}
