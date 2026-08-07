import type { Request, Response } from "express";

import { UnauthorizedError } from "../../../core/errors/index.js";
import { requireId } from "../../../core/http/validators/index.js";
import { NotificationsService } from "../services/notifications.service.js";
import { FindNotificationsRequestValidator } from "../validators/find-notifications.request.validator.js";

export class NotificationsController {
  constructor(
    private readonly service: NotificationsService,
    public readonly validator: FindNotificationsRequestValidator,
  ) {}

  async findAll(request: Request, response: Response): Promise<void> {
    if (!request.user) {
      throw new UnauthorizedError("Unauthorized.", "UNAUTHORIZED");
    }

    const dto = this.validator.validate(request.query);

    const notifications = await this.service.findAllByUser(request.user.userId, dto);

    response.json(notifications);
  }

  async countUnread(request: Request, response: Response): Promise<void> {
    if (!request.user) {
      throw new UnauthorizedError("Unauthorized.", "UNAUTHORIZED");
    }

    const unreadCount = await this.service.countUnread(request.user.userId);

    response.json({
      unreadCount,
    });
  }

  async markRead(request: Request, response: Response): Promise<void> {
    if (!request.user) {
      throw new UnauthorizedError("Unauthorized.", "UNAUTHORIZED");
    }

    const notificationId = requireId(request.params.id, "notificationId");

    const notification = await this.service.markRead(notificationId, request.user.userId);

    response.json(notification);
  }

  async markAllRead(request: Request, response: Response): Promise<void> {
    if (!request.user) {
      throw new UnauthorizedError("Unauthorized.", "UNAUTHORIZED");
    }

    await this.service.markAllRead(request.user.userId);

    response.sendStatus(204);
  }
}
