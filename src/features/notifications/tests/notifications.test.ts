import { describe, expect, beforeEach, jest } from "@jest/globals";

import { NotificationsService } from "../services/notifications.service.js";
import type { INotificationsRepository } from "../interfaces/notifications.repository.interface.js";
import type { SocketEventPublisher } from "../../../core/websocket/publishers/socket-event.publisher.js";

import type { NotificationModel } from "../models/notification.model.js";
import type { NotificationPayload } from "../models/notification-payload.model.js";
import type { FindNotificationsDto } from "../dto/find-notifications.dto.js";
import { NotificationType } from "../enums/notification-type.enum.js";
import { NotFoundError } from "../../../core/errors/index.js";

const mockRepository: jest.Mocked<INotificationsRepository> = {
  create: jest.fn(),
  findAllByUser: jest.fn(),
  countUnread: jest.fn(),
  markRead: jest.fn(),
  markAllRead: jest.fn(),
  findById: jest.fn(),
};

const mockSocketPublisher: jest.Mocked<SocketEventPublisher> = {
  notificationCreated: jest.fn(),
  attach: jest.fn(),
  emitToChat: jest.fn(),
  emitToUser: jest.fn(),
  messageCreated: jest.fn(),
  messageUpdated: jest.fn(),
  messageDeleted: jest.fn(),
  messagePinned: jest.fn(),
  messageUnpinned: jest.fn(),
  typingStarted: jest.fn(),
  typingStopped: jest.fn(),
  messageRead: jest.fn(),
  userOnline: jest.fn(),
  userOffline: jest.fn(),
  reactionUpdated: jest.fn(),
  chatChanged: jest.fn(),
};

let notificationsService: NotificationsService;

beforeEach(() => {
  jest.clearAllMocks();
  notificationsService = new NotificationsService(
    mockRepository as unknown as INotificationsRepository,
    mockSocketPublisher as unknown as SocketEventPublisher,
  );
});

describe("NotificationsService", () => {
  describe("create", () => {
    it("should create a notification and publish socket event", async () => {
      const userId = "user123";
      const type = NotificationType.Message;
      const payload: NotificationPayload = { message: "Test message" };

      const expectedNotification: NotificationModel = {
        id: "notif123",
        userId,
        type,
        payload,
        isRead: false,
        createdAt: new Date(),
        readAt: null,
      };

      mockRepository.create.mockResolvedValue(expectedNotification);

      const result = await notificationsService.create(userId, type, payload);

      expect(result).toEqual(expectedNotification);
      expect(mockRepository.create).toHaveBeenCalledWith(userId, type, payload);
      expect(mockSocketPublisher.notificationCreated).toHaveBeenCalledWith(expectedNotification);
    });
  });

  describe("findAllByUser", () => {
    it("should return all notifications for a user", async () => {
      const userId = "user123";
      const dto: FindNotificationsDto = { limit: 10, offset: 0 };

      const expectedNotifications = [
        {
          id: "notif1",
          userId,
          type: NotificationType.Message,
          payload: {},
          isRead: false,
          createdAt: new Date(),
          readAt: null,
        },
        {
          id: "notif2",
          userId,
          type: NotificationType.ChatUpdated,
          payload: {},
          isRead: false,
          createdAt: new Date(),
          readAt: null,
        },
      ];

      mockRepository.findAllByUser.mockResolvedValue(expectedNotifications);

      const result = await notificationsService.findAllByUser(userId, dto);

      expect(result).toEqual(expectedNotifications);
      expect(mockRepository.findAllByUser).toHaveBeenCalledWith(userId, dto);
    });
  });

  describe("countUnread", () => {
    it("should return correct unread count", async () => {
      const userId = "user123";

      mockRepository.countUnread.mockResolvedValue(5);

      const result = await notificationsService.countUnread(userId);

      expect(result).toBe(5);
      expect(mockRepository.countUnread).toHaveBeenCalledWith(userId);
    });
  });

  describe("markRead", () => {
    it("should mark notification as read and return updated notification", async () => {
      const userId = "user123";
      const notificationId = "notif123";

      const expectedNotification: NotificationModel = {
        id: notificationId,
        userId,
        type: NotificationType.ChatUpdated,
        payload: {},
        isRead: true,
        createdAt: new Date(),
        readAt: new Date(),
      };

      mockRepository.markRead.mockResolvedValue(expectedNotification);

      const result = await notificationsService.markRead(notificationId, userId);

      expect(result).toEqual(expectedNotification);
      expect(mockRepository.markRead).toHaveBeenCalledWith(userId, notificationId);
    });

    it("should throw NotFoundError when notification doesn't exist", async () => {
      const userId = "user123";
      const notificationId = "notif123";

      mockRepository.markRead.mockResolvedValue(null);

      await expect(notificationsService.markRead(notificationId, userId)).rejects.toThrow(
        NotFoundError,
      );
      expect(mockRepository.markRead).toHaveBeenCalledWith(userId, notificationId);
    });
  });

  describe("markAllRead", () => {
    it("should mark all notifications as read", async () => {
      const userId = "user123";

      await notificationsService.markAllRead(userId);

      expect(mockRepository.markAllRead).toHaveBeenCalledWith(userId);
    });
  });
});
