import { Mapper } from "../../../core/mappers/mapper.js";
import { NotificationEntity } from "../entities/notification.entity.js";
import { NotificationModel } from "../models/notification.model.js";

export class NotificationMapper implements Mapper<NotificationEntity, NotificationModel> {
  map(entity: NotificationEntity): NotificationModel {
    return {
      id: entity.id,
      userId: entity.user_id,
      type: entity.type,
      payload: entity.payload,
      isRead: entity.is_read,
      createdAt: entity.created_at,
      readAt: entity.read_at,
    };
  }
}
