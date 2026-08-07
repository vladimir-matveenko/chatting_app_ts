import { NotificationType } from "../enums/notification-type.enum.js";

export interface FindNotificationsDto {
  type?: NotificationType;

  limit?: number;

  offset?: number;
}
