import { NotificationType } from "../../notifications/enums/notification-type.enum.js";
import { NotificationPayload } from "../../notifications/models/notification-payload.model.js";
import { NotificationsService } from "../../notifications/services/notifications.service.js";
import { AddChatMembersDto } from "../dto/add-chat-members.dto.js";
import { ChatMemberRole } from "../enums/chat-member-role.enum.js";
import { IChatMembersRepository } from "../interfaces/chat-members.repository.interface.js";

export class ChatNotificationsService {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly chatMembersRepository: IChatMembersRepository,
  ) {}

  async notifyInvited(chatId: string, actorId: string, dto: AddChatMembersDto): Promise<void> {
    const payload: NotificationPayload = {
      chatId,
      senderId: actorId,
    };

    const tasks = dto.memberIds
      .filter((id) => id !== actorId)
      .map((id) => this.notificationsService.create(id, NotificationType.ChatInvite, payload));

    await Promise.allSettled(tasks);
  }

  async notifyMembersAdded(chatId: string, actorId: string, dto: AddChatMembersDto): Promise<void> {
    const userIds = await this.chatMembersRepository.findMembersIdsByChat(chatId);

    const payload: NotificationPayload = {
      chatId,
      senderId: actorId,
    };

    const addedMembers = new Set(dto.memberIds);

    const tasks = userIds
      .filter((id) => id !== actorId)
      .filter((id) => !addedMembers.has(id))
      .map((id) => this.notificationsService.create(id, NotificationType.MemberAdded, payload));

    await Promise.allSettled(tasks);
  }

  async notifyMemberRemoved(chatId: string, actorId: string, memberId: string): Promise<void> {
    const payload: NotificationPayload = {
      chatId,
      senderId: actorId,
    };

    const userIds = await this.chatMembersRepository.findMembersIdsByChat(chatId);

    await Promise.allSettled([
      // for deleted user
      this.notificationsService.create(memberId, NotificationType.MemberRemoved, payload),

      // for left users
      ...userIds
        .filter((id) => id !== actorId)
        .map((id) =>
          this.notificationsService.create(id, NotificationType.MemberRemoved, {
            ...payload,
            memberId,
          }),
        ),
    ]);
  }

  async notifyOwnershipTransferred(
    chatId: string,
    previousOwnerId: string,
    newOwnerId: string,
  ): Promise<void> {
    await this.notificationsService.create(newOwnerId, NotificationType.OwnerChanged, {
      chatId,
      senderId: previousOwnerId,
    });
  }

  async notifyChatUpdated(chatId: string, actorId: string): Promise<void> {
    const userIds = await this.chatMembersRepository.findMembersIdsByChat(chatId);

    const payload: NotificationPayload = {
      chatId,
      senderId: actorId,
    };

    await Promise.allSettled(
      userIds
        .filter((id) => id !== actorId)
        .map((id) => this.notificationsService.create(id, NotificationType.ChatUpdated, payload)),
    );
  }

  async notifyMemberRoleChanged(
    chatId: string,
    actorId: string,
    memberId: string,
    role: ChatMemberRole,
  ): Promise<void> {
    let type: NotificationType;

    switch (role) {
      case ChatMemberRole.ADMIN:
        type = NotificationType.AdminGranted;
        break;

      case ChatMemberRole.MEMBER:
        type = NotificationType.AdminRevoked;
        break;

      default:
        return;
    }

    const payload: NotificationPayload = {
      chatId,
      senderId: actorId,
    };

    await this.notificationsService.create(memberId, type, payload);
  }
}
