import { Mapper } from "../../../core/mappers/mapper.js";
import { NotificationEntity } from "../entities/notification.entity.js";
import { NotificationModel } from "../models/notification.model.js";

export class NotificationMapper implements Mapper<NotificationEntity, NotificationModel> {
  map(entity: NotificationEntity): NotificationModel {
    return {
      id: entity.id,
      userId: entity.userId,
      type: entity.type,
      payload: entity.payload,
      isRead: entity.isRead,
      createdAt: entity.createdAt,
      readAt: entity.readAt,
    };
  }
}
