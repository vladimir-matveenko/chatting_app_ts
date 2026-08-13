import { ForbiddenError, NotFoundError, ValidationError } from "../../../core/errors/index.js";
import {
  ManageMembersPermissions,
  TransferOwnershipPermissions,
} from "../constants/chat-member-permissions.js";
import { EditChatPermissions } from "../constants/edit-chat-permissions.js";
import { IChatMembersRepository } from "../interfaces/chat-members.repository.interface.js";
import { IChatsRepository } from "../interfaces/chats.repository.interface.js";

export class ChatPermissionsService {
  constructor(
    private readonly chatMembersRepository: IChatMembersRepository,
    private readonly chatsRepository: IChatsRepository,
  ) {}

  async ensureMember(
    chatId: string,

    userId: string,
  ): Promise<void> {
    await this.getMemberOrThrow(chatId, userId);
  }

  async ensureCanManageMembers(
    chatId: string,

    actorId: string,

    targetId: string,
  ): Promise<void> {
    if (actorId === targetId) {
      throw new ValidationError("Use leave() to leave the chat.");
    }

    const actor = await this.chatMembersRepository.findByChatAndUser(
      chatId,

      actorId,
    );

    if (!actor) {
      throw new ForbiddenError(
        "You are not a member of this chat.",

        "CHAT_ACCESS_DENIED",
      );
    }

    const target = await this.chatMembersRepository.findByChatAndUser(
      chatId,

      targetId,
    );

    if (!target) {
      throw new NotFoundError("Member not found.");
    }

    const allowedRoles = ManageMembersPermissions[actor.role];

    if (!allowedRoles.includes(target.role)) {
      throw new ForbiddenError(
        "Insufficient permissions.",

        "INSUFFICIENT_PERMISSIONS",
      );
    }
  }

  async ensureCanEditChat(chatId: string, userId: string): Promise<void> {
    const member = await this.getMemberOrThrow(chatId, userId);

    if (!EditChatPermissions.has(member.role)) {
      throw new ForbiddenError("You don't have permission to edit this chat.", "EDIT_CHAT_DENIED");
    }
  }

  async ensureCanTransferOwnership(
    chatId: string,
    ownerId: string,
    newOwnerId: string,
  ): Promise<void> {
    const owner = await this.getMemberOrThrow(chatId, ownerId);
    const newOwner = await this.getMemberOrThrow(chatId, newOwnerId);

    if (TransferOwnershipPermissions[owner.role].length === 0) {
      throw new ForbiddenError(
        "You don't have permission to transfer ownership.",
        "TRANSFER_OWNERSHIP_DENIED",
      );
    }

    if (!TransferOwnershipPermissions[owner.role].includes(newOwner.role)) {
      throw new ForbiddenError(
        "The new user don't have permission to get ownership.",
        "TRANSFER_OWNERSHIP_DENIED",
      );
    }
  }

  private async getMemberOrThrow(chatId: string, userId: string) {
    const member = await this.chatMembersRepository.findByChatAndUser(chatId, userId);

    if (!member) {
      throw new ForbiddenError("You are not a member of this chat.", "CHAT_ACCESS_DENIED");
    }

    return member;
  }
}
