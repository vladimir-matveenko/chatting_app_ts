import { IChatMembersRepository } from "../../chats/interfaces/chat-members.repository.interface.js";
import { NotificationType } from "../../notifications/enums/notification-type.enum.js";
import { NotificationPayload } from "../../notifications/models/notification-payload.model.js";
import { NotificationsService } from "../../notifications/services/notifications.service.js";
import { Message } from "../models/message.model.js";

export class MessagesNotificationsService {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly chatMembersRepository: IChatMembersRepository,
  ) {}

  async notifyMessagesCreated(message: Message, repliedMessage: Message | null): Promise<void> {
    await Promise.allSettled([
      this.notifyMessageCreated(message),
      this.notifyMessageReplied(message, repliedMessage),
    ]);
  }

  private async notifyMessageCreated(message: Message): Promise<void> {
    const userIds = await this.chatMembersRepository.findMembersIdsByChat(message.chatId);

    const payload: NotificationPayload = {
      chatId: message.chatId,
      messageId: message.id,
      senderId: message.sender.id,
    };

    const tasks = userIds
      .filter((id) => id !== message.sender.id)
      .map((id) => this.notificationsService.create(id, NotificationType.Message, payload));

    await Promise.allSettled(tasks);
  }

  async notifyMessageReplied(message: Message, repliedMessage: Message | null): Promise<void> {
    if (!repliedMessage) {
      return;
    }

    if (repliedMessage.sender.id === message.sender.id) {
      return;
    }

    const payload: NotificationPayload = {
      chatId: message.chatId,
      messageId: message.id,
      senderId: message.sender.id,
    };

    await this.notificationsService.create(
      repliedMessage.sender.id,
      NotificationType.Reply,
      payload,
    );
  }
}
