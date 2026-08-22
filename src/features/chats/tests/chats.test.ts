import { describe, expect, beforeEach, jest } from "@jest/globals";
import type { PoolClient } from "pg";

import { ChatsService } from "../services/chats.service.js";

import type { IChatsRepository } from "../interfaces/chats.repository.interface.js";
import type { IChatListRepository } from "../interfaces/chat-list.repository.interface.js";
import type { IChatMembersRepository } from "../interfaces/chat-members.repository.interface.js";
import type { IUsersRepository } from "../../users/interfaces/users.repository.interface.js";

import type { Database } from "../../../core/database/database.js";

import { ChatFingerprintService } from "../services/chat-fingerprint.service.js";
import type { PresenceService } from "../../../core/websocket/services/presence.service.js";
import type { ChatPermissionsService } from "../services/chat-permissions.service.js";
import type { ChatNotificationsService } from "../services/chat-notifications.service.js";

import { ChatType } from "../enums/chat-type.enum.js";
import { ChatMemberRole } from "../enums/chat-member-role.enum.js";

import { NotFoundError, ValidationError } from "../../../core/errors/index.js";

import type { CreateChatDto } from "../dto/create-chat.dto.js";
import type { ArchiveChatDto } from "../dto/archive-chat.dto.js";
import type { MuteChatDto } from "../dto/mute-chat.dto.js";
import type { AddChatMembersDto } from "../dto/add-chat-members.dto.js";
import type { TransferOwnershipDto } from "../dto/transfer-ownership.dto.js";
import type { UpdateChatDto } from "../dto/update-chat.dto.js";

import type { Chat } from "../models/chat.model.js";
import type { ChatMember } from "../models/chat-member.model.js";
import type { ChatListItem } from "../models/chat-list-item.model.js";

import type { FindUsersDto } from "../../users/dto/find-users.dto.js";

type TransactionMock = jest.MockedFunction<
  <T>(callback: (client: PoolClient) => Promise<T>) => Promise<T>
>;

describe("ChatsService", () => {
  let chatsService: ChatsService;

  let mockDatabase: {
    transaction: TransactionMock;
  };

  let mockUsersRepository: jest.Mocked<Pick<IUsersRepository, "findByIds">>;

  let mockChatsRepository: jest.Mocked<
    Pick<
      IChatsRepository,
      "findByFingerprintTx" | "createTx" | "findById" | "archive" | "updateOwnerTx" | "update"
    >
  >;

  let mockChatListRepository: jest.Mocked<
    Pick<IChatListRepository, "findByUser" | "findArchivedByUser">
  >;

  let mockChatMembersRepository: jest.Mocked<
    Pick<
      IChatMembersRepository,
      | "addTx"
      | "findByChat"
      | "findByChatAndUser"
      | "mute"
      | "leave"
      | "addMembers"
      | "removeMember"
      | "updateRole"
      | "updateRoleTx"
    >
  >;

  let mockFingerprintService: jest.Mocked<Pick<ChatFingerprintService, "build">>;

  let mockPresenceService: jest.Mocked<Pick<PresenceService, "isOnline">>;

  let mockChatPermissionsService: jest.Mocked<
    Pick<
      ChatPermissionsService,
      "ensureMember" | "ensureCanManageMembers" | "ensureCanTransferOwnership" | "ensureCanEditChat"
    >
  >;

  let mockChatNotificationsService: jest.Mocked<
    Pick<
      ChatNotificationsService,
      | "notifyInvited"
      | "notifyMembersAdded"
      | "notifyMemberRemoved"
      | "notifyMemberRoleChanged"
      | "notifyOwnershipTransferred"
      | "notifyChatUpdated"
    >
  >;

  const createChat = (overrides: Partial<Chat> = {}): Chat =>
    ({
      id: "chat123",
      type: ChatType.GROUP,
      ownerId: "user123",
      ...overrides,
    }) as Chat;

  const createChatMember = (overrides: Partial<ChatMember> = {}): ChatMember =>
    ({
      chatId: "chat123",
      userId: "user123",
      role: ChatMemberRole.MEMBER,
      ...overrides,
    }) as ChatMember;

  const createChatListItem = (overrides: Partial<ChatListItem> = {}): ChatListItem =>
    ({ ...overrides }) as ChatListItem;

  const createChatDto = (overrides: Partial<CreateChatDto> = {}): CreateChatDto =>
    ({
      type: ChatType.GROUP,
      ownerId: "user123",
      memberIds: ["user456", "user789"],
      fingerprint: undefined,
      title: undefined,
      avatarUrl: undefined,
      ...overrides,
    }) as unknown as CreateChatDto;

  beforeEach(() => {
    jest.clearAllMocks();

    mockDatabase = {
      transaction: jest.fn() as TransactionMock,
    };

    mockUsersRepository = {
      findByIds: jest.fn(),
    };

    mockChatsRepository = {
      findByFingerprintTx: jest.fn(),
      createTx: jest.fn(),
      findById: jest.fn(),
      archive: jest.fn(),
      updateOwnerTx: jest.fn(),
      update: jest.fn(),
    };

    mockChatListRepository = {
      findByUser: jest.fn(),
      findArchivedByUser: jest.fn(),
    };

    mockChatMembersRepository = {
      addTx: jest.fn(),
      findByChat: jest.fn(),
      findByChatAndUser: jest.fn(),
      mute: jest.fn(),
      leave: jest.fn(),
      addMembers: jest.fn(),
      removeMember: jest.fn(),
      updateRole: jest.fn(),
      updateRoleTx: jest.fn(),
    };

    mockFingerprintService = {
      build: jest.fn(),
    };

    mockPresenceService = {
      isOnline: jest.fn(),
    };

    mockChatPermissionsService = {
      ensureMember: jest.fn(),
      ensureCanManageMembers: jest.fn(),
      ensureCanTransferOwnership: jest.fn(),
      ensureCanEditChat: jest.fn(),
    };

    mockChatNotificationsService = {
      notifyInvited: jest.fn(),
      notifyMembersAdded: jest.fn(),
      notifyMemberRemoved: jest.fn(),
      notifyMemberRoleChanged: jest.fn(),
      notifyOwnershipTransferred: jest.fn(),
      notifyChatUpdated: jest.fn(),
    };

    mockDatabase.transaction.mockImplementation(
      async <T>(callback: (client: PoolClient) => Promise<T>): Promise<T> => {
        return callback({} as PoolClient);
      },
    );

    mockFingerprintService.build.mockReturnValue("fingerprint123");

    chatsService = new ChatsService(
      mockDatabase as unknown as Database,
      mockUsersRepository as unknown as IUsersRepository,
      mockChatsRepository as unknown as IChatsRepository,
      mockChatListRepository as unknown as IChatListRepository,
      mockChatMembersRepository as unknown as IChatMembersRepository,
      mockFingerprintService as unknown as ChatFingerprintService,
      mockPresenceService as unknown as PresenceService,
      mockChatPermissionsService as unknown as ChatPermissionsService,
      mockChatNotificationsService as unknown as ChatNotificationsService,
    );
  });

  describe("create", () => {
    it("should create a new group chat successfully", async () => {
      const dto = createChatDto({
        type: ChatType.GROUP,
        ownerId: "user123",
        memberIds: ["user456", "user789"],
        title: "Test Chat",
      });

      const expectedChat = createChat({
        id: "chat123",
        type: ChatType.GROUP,
        ownerId: "user123",
      });

      mockUsersRepository.findByIds.mockResolvedValue([{} as any, {} as any, {} as any]);

      mockChatsRepository.findByFingerprintTx.mockResolvedValue(null);

      mockChatsRepository.createTx.mockResolvedValue(expectedChat);

      const result = await chatsService.create(dto);

      expect(result).toEqual(expectedChat);

      expect(mockUsersRepository.findByIds).toHaveBeenCalledWith(["user456", "user789", "user123"]);

      expect(mockFingerprintService.build).toHaveBeenCalledWith({
        ...dto,
        memberIds: ["user456", "user789", "user123"],
      });

      expect(mockDatabase.transaction).toHaveBeenCalled();

      expect(mockChatsRepository.findByFingerprintTx).toHaveBeenCalledWith(
        expect.anything(),
        "fingerprint123",
      );

      expect(mockChatsRepository.createTx).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          ...dto,
          memberIds: ["user456", "user789", "user123"],
          fingerprint: "fingerprint123",
        }),
      );

      expect(mockChatMembersRepository.addTx).toHaveBeenCalledTimes(3);

      expect(mockChatMembersRepository.addTx).toHaveBeenNthCalledWith(1, expect.anything(), {
        chatId: "chat123",
        userId: "user456",
        role: ChatMemberRole.MEMBER,
      });

      expect(mockChatMembersRepository.addTx).toHaveBeenNthCalledWith(2, expect.anything(), {
        chatId: "chat123",
        userId: "user789",
        role: ChatMemberRole.MEMBER,
      });

      expect(mockChatMembersRepository.addTx).toHaveBeenNthCalledWith(3, expect.anything(), {
        chatId: "chat123",
        userId: "user123",
        role: ChatMemberRole.OWNER,
      });
    });

    it("should add owner to memberIds when owner is not included", async () => {
      const dto = createChatDto({
        type: ChatType.GROUP,
        ownerId: "user123",
        memberIds: ["user456", "user789"],
      });

      const expectedChat = createChat();

      mockUsersRepository.findByIds.mockResolvedValue([{} as any, {} as any, {} as any]);

      mockChatsRepository.findByFingerprintTx.mockResolvedValue(null);
      mockChatsRepository.createTx.mockResolvedValue(expectedChat);

      await chatsService.create(dto);

      expect(mockUsersRepository.findByIds).toHaveBeenCalledWith(["user456", "user789", "user123"]);

      expect(mockChatsRepository.createTx).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          memberIds: ["user456", "user789", "user123"],
        }),
      );
    });

    it("should remove duplicate memberIds", async () => {
      const dto = createChatDto({
        type: ChatType.GROUP,
        ownerId: "user123",
        memberIds: ["user456", "user456", "user789", "user123"],
      });

      const expectedChat = createChat();

      mockUsersRepository.findByIds.mockResolvedValue([{} as any, {} as any, {} as any]);

      mockChatsRepository.findByFingerprintTx.mockResolvedValue(null);
      mockChatsRepository.createTx.mockResolvedValue(expectedChat);

      await chatsService.create(dto);

      expect(mockUsersRepository.findByIds).toHaveBeenCalledWith(["user456", "user789", "user123"]);
    });

    it("should return existing chat when fingerprint already exists", async () => {
      const dto = createChatDto({
        type: ChatType.PRIVATE,
        ownerId: "user123",
        memberIds: ["user456"],
      });

      const existingChat = createChat({
        id: "existing-chat",
        type: ChatType.PRIVATE,
      });

      mockUsersRepository.findByIds.mockResolvedValue([{} as any, {} as any]);

      mockChatsRepository.findByFingerprintTx.mockResolvedValue(existingChat);

      const result = await chatsService.create(dto);

      expect(result).toEqual(existingChat);

      expect(mockChatsRepository.createTx).not.toHaveBeenCalled();
      expect(mockChatMembersRepository.addTx).not.toHaveBeenCalled();
    });

    it("should throw ValidationError when one or more users do not exist", async () => {
      const dto = createChatDto({
        type: ChatType.GROUP,
        ownerId: "user123",
        memberIds: ["user456", "user789"],
      });

      mockUsersRepository.findByIds.mockResolvedValue([{} as any]);

      await expect(chatsService.create(dto)).rejects.toThrow(ValidationError);

      expect(mockFingerprintService.build).not.toHaveBeenCalled();
      expect(mockDatabase.transaction).not.toHaveBeenCalled();
      expect(mockChatsRepository.createTx).not.toHaveBeenCalled();
    });

    it("should throw ValidationError when private chat has invalid number of members", async () => {
      const dto = createChatDto({
        type: ChatType.PRIVATE,
        ownerId: "user123",
        memberIds: ["user456", "user789"],
      });

      await expect(chatsService.create(dto)).rejects.toThrow(ValidationError);

      expect(mockUsersRepository.findByIds).not.toHaveBeenCalled();
      expect(mockDatabase.transaction).not.toHaveBeenCalled();
    });

    it("should throw ValidationError when group chat has less than two members", async () => {
      const dto = createChatDto({
        type: ChatType.GROUP,
        ownerId: "user123",
        memberIds: [],
      });

      await expect(chatsService.create(dto)).rejects.toThrow(ValidationError);

      expect(mockUsersRepository.findByIds).not.toHaveBeenCalled();
      expect(mockDatabase.transaction).not.toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("should return chat when found", async () => {
      const chatId = "chat123";
      const userId = "user123";
      const expectedChat = createChat();

      mockChatsRepository.findById.mockResolvedValue(expectedChat);

      const result = await chatsService.findById(chatId, userId);

      expect(result).toEqual(expectedChat);

      expect(mockChatPermissionsService.ensureMember).toHaveBeenCalledWith(chatId, userId);

      expect(mockChatsRepository.findById).toHaveBeenCalledWith(chatId, userId);
    });

    it("should throw NotFoundError when chat is not found", async () => {
      const chatId = "nonexistent";
      const userId = "user123";

      mockChatsRepository.findById.mockResolvedValue(null);

      await expect(chatsService.findById(chatId, userId)).rejects.toThrow(NotFoundError);

      expect(mockChatPermissionsService.ensureMember).toHaveBeenCalledWith(chatId, userId);
    });
  });

  describe("findByUser", () => {
    it("should return user's chats", async () => {
      const userId = "user123";

      const dto: FindUsersDto = {
        query: "test",
        limit: 20,
        offset: 0,
      };

      const expectedChats = [
        createChatListItem({
          id: "chat123",
        }),
        createChatListItem({
          id: "chat456",
        }),
      ];

      mockChatListRepository.findByUser.mockResolvedValue(expectedChats);

      const result = await chatsService.findByUser(userId, dto);

      expect(result).toEqual(expectedChats);

      expect(mockChatListRepository.findByUser).toHaveBeenCalledWith(userId, dto);
    });
  });

  describe("findArchivedByUser", () => {
    it("should return archived user's chats", async () => {
      const userId = "user123";

      const dto: FindUsersDto = {
        query: "test",
        limit: 20,
        offset: 0,
      };

      const expectedChats = [
        createChatListItem({
          id: "chat123",
        }),
      ];

      mockChatListRepository.findArchivedByUser.mockResolvedValue(expectedChats);

      const result = await chatsService.findArchivedByUser(userId, dto);

      expect(result).toEqual(expectedChats);

      expect(mockChatListRepository.findArchivedByUser).toHaveBeenCalledWith(userId, dto);
    });
  });

  describe("findMembers", () => {
    it("should return members with online status", async () => {
      const chatId = "chat123";
      const userId = "user123";

      const dto: FindUsersDto = {
        query: "",
        limit: 20,
        offset: 0,
      };

      const members = [
        createChatMember({
          userId: "user123",
        }),
        createChatMember({
          userId: "user456",
        }),
      ];

      mockChatMembersRepository.findByChat.mockResolvedValue(members);

      mockPresenceService.isOnline.mockReturnValueOnce(true).mockReturnValueOnce(false);

      const result = await chatsService.findMembers(chatId, userId, dto);

      expect(result).toEqual([
        {
          ...members[0],
          isOnline: true,
        },
        {
          ...members[1],
          isOnline: false,
        },
      ]);

      expect(mockChatPermissionsService.ensureMember).toHaveBeenCalledWith(chatId, userId);

      expect(mockChatMembersRepository.findByChat).toHaveBeenCalledWith(chatId, dto);

      expect(mockPresenceService.isOnline).toHaveBeenNthCalledWith(1, "user123");

      expect(mockPresenceService.isOnline).toHaveBeenNthCalledWith(2, "user456");
    });
  });

  describe("findMemberById", () => {
    it("should return member when found", async () => {
      const chatId = "chat123";
      const userId = "user456";

      const expectedMember = createChatMember({
        userId,
      });

      mockChatMembersRepository.findByChatAndUser.mockResolvedValue(expectedMember);

      const result = await chatsService.findMemberById(chatId, userId);

      expect(result).toEqual(expectedMember);

      expect(mockChatPermissionsService.ensureMember).toHaveBeenCalledWith(chatId, userId);

      expect(mockChatMembersRepository.findByChatAndUser).toHaveBeenCalledWith(chatId, userId);
    });

    it("should return null when member is not found", async () => {
      const chatId = "chat123";
      const userId = "user456";

      mockChatMembersRepository.findByChatAndUser.mockResolvedValue(null);

      const result = await chatsService.findMemberById(chatId, userId);

      expect(result).toBeNull();
    });
  });

  describe("archive", () => {
    it("should archive chat successfully", async () => {
      const chatId = "chat123";
      const userId = "user123";

      const dto: ArchiveChatDto = {
        isArchived: true,
      };

      await chatsService.archive(chatId, userId, dto);

      expect(mockChatPermissionsService.ensureMember).toHaveBeenCalledWith(chatId, userId);

      expect(mockChatsRepository.archive).toHaveBeenCalledWith(chatId, userId, true);
    });

    it("should unarchive chat successfully", async () => {
      const chatId = "chat123";
      const userId = "user123";

      const dto: ArchiveChatDto = {
        isArchived: false,
      };

      await chatsService.archive(chatId, userId, dto);

      expect(mockChatsRepository.archive).toHaveBeenCalledWith(chatId, userId, false);
    });
  });

  describe("mute", () => {
    it("should mute chat successfully", async () => {
      const chatId = "chat123";
      const userId = "user123";

      const dto: MuteChatDto = {
        isMuted: true,
      };

      await chatsService.mute(chatId, userId, dto);

      expect(mockChatPermissionsService.ensureMember).toHaveBeenCalledWith(chatId, userId);

      expect(mockChatMembersRepository.mute).toHaveBeenCalledWith(chatId, userId, true);
    });

    it("should unmute chat successfully", async () => {
      const chatId = "chat123";
      const userId = "user123";

      const dto: MuteChatDto = {
        isMuted: false,
      };

      await chatsService.mute(chatId, userId, dto);

      expect(mockChatMembersRepository.mute).toHaveBeenCalledWith(chatId, userId, false);
    });
  });

  describe("leave", () => {
    it("should leave group chat successfully", async () => {
      const chatId = "chat123";
      const userId = "user123";

      mockChatsRepository.findById.mockResolvedValue(
        createChat({
          type: ChatType.GROUP,
        }),
      );

      await chatsService.leave(chatId, userId);

      expect(mockChatPermissionsService.ensureMember).toHaveBeenCalledWith(chatId, userId);

      expect(mockChatsRepository.findById).toHaveBeenCalledWith(chatId, userId);

      expect(mockChatMembersRepository.leave).toHaveBeenCalledWith(chatId, userId);
    });

    it("should throw NotFoundError when chat is not found", async () => {
      const chatId = "nonexistent";
      const userId = "user123";

      mockChatsRepository.findById.mockResolvedValue(null);

      await expect(chatsService.leave(chatId, userId)).rejects.toThrow(NotFoundError);

      expect(mockChatMembersRepository.leave).not.toHaveBeenCalled();
    });

    it("should throw ValidationError when leaving private chat", async () => {
      const chatId = "chat123";
      const userId = "user123";

      mockChatsRepository.findById.mockResolvedValue(
        createChat({
          type: ChatType.PRIVATE,
        }),
      );

      await expect(chatsService.leave(chatId, userId)).rejects.toThrow(ValidationError);

      expect(mockChatMembersRepository.leave).not.toHaveBeenCalled();
    });
  });

  describe("addMembers", () => {
    it("should add members successfully", async () => {
      const chatId = "chat123";
      const actorId = "user123";

      const dto: AddChatMembersDto = {
        memberIds: ["user456", "user789"],
      };

      mockChatsRepository.findById.mockResolvedValue(
        createChat({
          type: ChatType.GROUP,
        }),
      );

      mockUsersRepository.findByIds.mockResolvedValue([{} as any, {} as any]);

      await chatsService.addMembers(chatId, actorId, dto);

      expect(mockChatPermissionsService.ensureMember).toHaveBeenCalledWith(chatId, actorId);

      expect(mockChatsRepository.findById).toHaveBeenCalledWith(chatId, actorId);

      expect(mockUsersRepository.findByIds).toHaveBeenCalledWith(dto.memberIds);

      expect(mockChatMembersRepository.addMembers).toHaveBeenCalledWith(chatId, dto.memberIds);

      expect(mockChatNotificationsService.notifyInvited).toHaveBeenCalledWith(chatId, actorId, dto);

      expect(mockChatNotificationsService.notifyMembersAdded).toHaveBeenCalledWith(
        chatId,
        actorId,
        dto,
      );
    });

    it("should throw NotFoundError when chat is not found", async () => {
      const chatId = "nonexistent";
      const actorId = "user123";

      const dto: AddChatMembersDto = {
        memberIds: ["user456"],
      };

      mockChatsRepository.findById.mockResolvedValue(null);

      await expect(chatsService.addMembers(chatId, actorId, dto)).rejects.toThrow(NotFoundError);

      expect(mockUsersRepository.findByIds).not.toHaveBeenCalled();
      expect(mockChatMembersRepository.addMembers).not.toHaveBeenCalled();
    });

    it("should throw ValidationError when adding members to private chat", async () => {
      const chatId = "chat123";
      const actorId = "user123";

      const dto: AddChatMembersDto = {
        memberIds: ["user456"],
      };

      mockChatsRepository.findById.mockResolvedValue(
        createChat({
          type: ChatType.PRIVATE,
        }),
      );

      await expect(chatsService.addMembers(chatId, actorId, dto)).rejects.toThrow(ValidationError);

      expect(mockUsersRepository.findByIds).not.toHaveBeenCalled();
      expect(mockChatMembersRepository.addMembers).not.toHaveBeenCalled();
    });

    it("should throw ValidationError when one or more users do not exist", async () => {
      const chatId = "chat123";
      const actorId = "user123";

      const dto: AddChatMembersDto = {
        memberIds: ["user456", "user789"],
      };

      mockChatsRepository.findById.mockResolvedValue(
        createChat({
          type: ChatType.GROUP,
        }),
      );

      mockUsersRepository.findByIds.mockResolvedValue([{} as any]);

      await expect(chatsService.addMembers(chatId, actorId, dto)).rejects.toThrow(ValidationError);

      expect(mockChatMembersRepository.addMembers).not.toHaveBeenCalled();

      expect(mockChatNotificationsService.notifyInvited).not.toHaveBeenCalled();

      expect(mockChatNotificationsService.notifyMembersAdded).not.toHaveBeenCalled();
    });
  });

  describe("removeMember", () => {
    it("should remove member successfully", async () => {
      const chatId = "chat123";
      const actorId = "user123";
      const memberId = "user456";

      await chatsService.removeMember(chatId, actorId, memberId);

      expect(mockChatPermissionsService.ensureCanManageMembers).toHaveBeenCalledWith(
        chatId,
        actorId,
        memberId,
      );

      expect(mockChatMembersRepository.removeMember).toHaveBeenCalledWith(chatId, memberId);

      expect(mockChatNotificationsService.notifyMemberRemoved).toHaveBeenCalledWith(
        chatId,
        actorId,
        memberId,
      );
    });
  });

  describe("transferOwnership", () => {
    it("should transfer ownership successfully", async () => {
      const chatId = "chat123";
      const actorId = "user123";

      const dto: TransferOwnershipDto = {
        userId: "user456",
      };

      mockChatsRepository.findById.mockResolvedValue(
        createChat({
          type: ChatType.GROUP,
        }),
      );

      await chatsService.transferOwnership(chatId, actorId, dto);

      expect(mockChatsRepository.findById).toHaveBeenCalledWith(chatId, actorId);

      expect(mockChatPermissionsService.ensureCanTransferOwnership).toHaveBeenCalledWith(
        chatId,
        actorId,
        dto.userId,
      );

      expect(mockDatabase.transaction).toHaveBeenCalled();

      expect(mockChatMembersRepository.updateRoleTx).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        chatId,
        actorId,
        ChatMemberRole.ADMIN,
      );

      expect(mockChatMembersRepository.updateRoleTx).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        chatId,
        dto.userId,
        ChatMemberRole.OWNER,
      );

      expect(mockChatsRepository.updateOwnerTx).toHaveBeenCalledWith(
        expect.anything(),
        chatId,
        dto.userId,
      );

      expect(mockChatNotificationsService.notifyOwnershipTransferred).toHaveBeenCalledWith(
        chatId,
        actorId,
        dto.userId,
      );
    });

    it("should throw ValidationError when transferring ownership to yourself", async () => {
      const chatId = "chat123";
      const actorId = "user123";

      const dto: TransferOwnershipDto = {
        userId: actorId,
      };

      await expect(chatsService.transferOwnership(chatId, actorId, dto)).rejects.toThrow(
        ValidationError,
      );

      expect(mockChatsRepository.findById).not.toHaveBeenCalled();
      expect(mockDatabase.transaction).not.toHaveBeenCalled();
    });

    it("should throw NotFoundError when chat is not found", async () => {
      const chatId = "nonexistent";
      const actorId = "user123";

      const dto: TransferOwnershipDto = {
        userId: "user456",
      };

      mockChatsRepository.findById.mockResolvedValue(null);

      await expect(chatsService.transferOwnership(chatId, actorId, dto)).rejects.toThrow(
        NotFoundError,
      );

      expect(mockChatPermissionsService.ensureCanTransferOwnership).not.toHaveBeenCalled();

      expect(mockDatabase.transaction).not.toHaveBeenCalled();
    });

    it("should throw ValidationError when transferring ownership of private chat", async () => {
      const chatId = "chat123";
      const actorId = "user123";

      const dto: TransferOwnershipDto = {
        userId: "user456",
      };

      mockChatsRepository.findById.mockResolvedValue(
        createChat({
          type: ChatType.PRIVATE,
        }),
      );

      await expect(chatsService.transferOwnership(chatId, actorId, dto)).rejects.toThrow(
        ValidationError,
      );

      expect(mockChatPermissionsService.ensureCanTransferOwnership).not.toHaveBeenCalled();

      expect(mockDatabase.transaction).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update chat successfully", async () => {
      const chatId = "chat123";
      const userId = "user123";

      const dto: UpdateChatDto = {
        title: "Updated Chat",
      } as UpdateChatDto;

      const updatedChat = createChat({
        id: chatId,
      });

      mockChatsRepository.update.mockResolvedValue(updatedChat);

      const result = await chatsService.update(chatId, userId, dto);

      expect(result).toEqual(updatedChat);

      expect(mockChatPermissionsService.ensureCanEditChat).toHaveBeenCalledWith(chatId, userId);

      expect(mockChatsRepository.update).toHaveBeenCalledWith(chatId, dto);

      expect(mockChatNotificationsService.notifyChatUpdated).toHaveBeenCalledWith(chatId, userId);
    });
  });
});
