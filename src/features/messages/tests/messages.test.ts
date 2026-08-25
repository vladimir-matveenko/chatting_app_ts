import { describe, expect, beforeEach, jest } from "@jest/globals";
import type { PoolClient } from "pg";

import { MessagesService } from "../services/messages.service.js";

import type { IMessagesRepository } from "../interfaces/messages.repository.interface.js";
import type { IMessageSearchRepository } from "../interfaces/message-search.repository.interface.js";
import type { IChatsRepository } from "../../chats/interfaces/chats.repository.interface.js";
import type { IChatMembersRepository } from "../../chats/interfaces/chat-members.repository.interface.js";
import type { MessagesNotificationsService } from "../services/messages-notifications.service.js";

import type { Database } from "../../../core/database/database.js";

import { Message } from "../models/message.model.js";
import { MessagesMode } from "../enums/message-mode.enum.js";
import { MessagesPage } from "../models/messages-page.model.js";
import { MessageType } from "../enums/message-type.enum.js";
import { ChatType } from "../../chats/enums/chat-type.enum.js";
import { ChatMemberRole } from "../../chats/enums/chat-member-role.enum.js";

import { NotFoundError, ValidationError, ForbiddenError } from "../../../core/errors/index.js";

import type { CreateMessageDto } from "../dto/create-message.dto.js";
import type { UpdateMessageRequestDto } from "../dto/request/update-message.request.dto.js";
import type { GetMessagesRequestDto } from "../dto/request/get-messages.request.dto.js";

import type { MessageSender } from "../models/message-sender.model.js";
import { Chat } from "../../chats/models/chat.model.js";

type TransactionMock = jest.MockedFunction<
  <T>(callback: (client: PoolClient) => Promise<T>) => Promise<T>
>;

describe("MessagesService", () => {
  let messagesService: MessagesService;

  let mockDatabase: {
    transaction: TransactionMock;
  };

  let mockMessagesRepository: jest.Mocked<
    Pick<
      IMessagesRepository,
      | "create"
      | "createTx"
      | "findById"
      | "update"
      | "delete"
      | "pin"
      | "unpin"
      | "findPinned"
      | "getByIdOrThrow"
      | "findLatest"
      | "findBefore"
      | "findAfter"
      | "findAroundMessage"
      | "hasMessagesBefore"
      | "hasMessagesAfter"
    >
  >;

  let mockMessagesSearchRepository: jest.Mocked<Pick<IMessageSearchRepository, "search">>;

  let mockChatsRepository: jest.Mocked<Pick<IChatsRepository, "findById" | "updateActivityTx">>;

  let mockChatMembersRepository: jest.Mocked<
    Pick<IChatMembersRepository, "isMember" | "findByChatAndUser" | "findMembersIdsByChat">
  >;

  let mockMessagesNotificationsService: jest.Mocked<
    Pick<MessagesNotificationsService, "notifyMessagesCreated">
  >;

  const createChat = (overrides: Partial<Chat> = {}): Chat =>
    ({
      id: "chat123",
      type: ChatType.GROUP,
      ownerId: "user123",
      ...overrides,
    }) as Chat;

  const createMessage = (overrides: Partial<Message> = {}): Message =>
    ({
      id: "message123",
      chatId: "chat123",
      sender: createMessageSender(),
      type: MessageType.TEXT,
      body: "Hello world",
      replyToId: null,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      reply: null,
      reactions: [],
      currentUserReaction: null,
      readCount: 0,
      ...overrides,
    }) as Message;

  const createMessageSender = (overrides: Partial<MessageSender> = {}): MessageSender =>
    ({
      id: "user123",
      userName: "testuser",
      displayName: "Test User",
      avatarUrl: null,
      ...overrides,
    }) as MessageSender;

  const createCreateMessageDto = (overrides: Partial<CreateMessageDto> = {}): CreateMessageDto =>
    ({
      chatId: "chat123",
      senderId: "user123",
      type: MessageType.TEXT,
      body: "Hello world",
      replyToId: null,
      ...overrides,
    }) as CreateMessageDto;

  const createUpdateMessageRequestDto = (
    overrides: Partial<UpdateMessageRequestDto> = {},
  ): UpdateMessageRequestDto =>
    ({
      body: "Updated message",
      ...overrides,
    }) as UpdateMessageRequestDto;

  const createGetMessagesRequestDto = (
    overrides: Partial<GetMessagesRequestDto> = {},
  ): GetMessagesRequestDto =>
    ({
      mode: MessagesMode.LATEST,
      limit: 50,
      ...overrides,
    }) as GetMessagesRequestDto;

  beforeEach(() => {
    jest.clearAllMocks();

    mockDatabase = {
      transaction: jest.fn() as TransactionMock,
    };

    mockMessagesRepository = {
      create: jest.fn(),
      createTx: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      pin: jest.fn(),
      unpin: jest.fn(),
      findPinned: jest.fn(),
      getByIdOrThrow: jest.fn(),
      findLatest: jest.fn(),
      findBefore: jest.fn(),
      findAfter: jest.fn(),
      findAroundMessage: jest.fn(),
      hasMessagesBefore: jest.fn(),
      hasMessagesAfter: jest.fn(),
    };

    mockMessagesSearchRepository = {
      search: jest.fn(),
    };

    mockChatsRepository = {
      findById: jest.fn(),
      updateActivityTx: jest.fn(),
    };

    mockChatMembersRepository = {
      isMember: jest.fn(),
      findByChatAndUser: jest.fn(),
      findMembersIdsByChat: jest.fn(),
    };

    mockMessagesNotificationsService = {
      notifyMessagesCreated: jest.fn(),
    };

    mockDatabase.transaction.mockImplementation(
      async <T>(callback: (client: PoolClient) => Promise<T>): Promise<T> => {
        return callback({} as PoolClient);
      },
    );

    messagesService = new MessagesService(
      mockDatabase as unknown as Database,
      mockMessagesRepository as unknown as IMessagesRepository,
      mockMessagesSearchRepository as unknown as IMessageSearchRepository,
      mockChatsRepository as unknown as IChatsRepository,
      mockChatMembersRepository as unknown as IChatMembersRepository,
      mockMessagesNotificationsService as unknown as MessagesNotificationsService,
    );
  });

  describe("create", () => {
    it("should create a new message successfully", async () => {
      const dto = createCreateMessageDto({
        chatId: "chat123",
        senderId: "user123",
        type: MessageType.TEXT,
        body: "Hello world",
      });

      const expectedMessage = createMessage({
        id: "message123",
        chatId: "chat123",
        sender: createMessageSender(),
      });

      mockChatsRepository.findById.mockResolvedValue(createChat());

      mockChatMembersRepository.isMember.mockResolvedValue(true);

      mockMessagesRepository.createTx.mockResolvedValue(expectedMessage);

      const result = await messagesService.create(dto);

      expect(result).toEqual(expectedMessage);

      expect(mockChatsRepository.findById).toHaveBeenCalledWith("chat123", "user123");
      expect(mockChatMembersRepository.isMember).toHaveBeenCalledWith("chat123", "user123");
      expect(mockDatabase.transaction).toHaveBeenCalled();
      expect(mockMessagesRepository.createTx).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          chatId: "chat123",
          senderId: "user123",
          type: MessageType.TEXT,
          body: "Hello world",
          replyToId: null,
        }),
      );
      expect(mockChatsRepository.updateActivityTx).toHaveBeenCalledWith(
        expect.anything(),
        "chat123",
      );
      expect(mockMessagesNotificationsService.notifyMessagesCreated).toHaveBeenCalledWith(
        expectedMessage,
        null,
      );
    });

    it("should throw NotFoundError when chat does not exist", async () => {
      const dto = createCreateMessageDto({
        chatId: "nonexistent",
        senderId: "user123",
        type: MessageType.TEXT,
        body: "Hello world",
      });

      mockChatsRepository.findById.mockResolvedValue(null);

      await expect(messagesService.create(dto)).rejects.toThrow(NotFoundError);

      expect(mockChatMembersRepository.isMember).not.toHaveBeenCalled();
      expect(mockDatabase.transaction).not.toHaveBeenCalled();
      expect(mockMessagesRepository.createTx).not.toHaveBeenCalled();
    });

    it("should throw ForbiddenError when user is not a member of the chat", async () => {
      const dto = createCreateMessageDto({
        chatId: "chat123",
        senderId: "user123",
        type: MessageType.TEXT,
        body: "Hello world",
      });

      mockChatsRepository.findById.mockResolvedValue({
        id: "chat123",
        type: ChatType.GROUP,
        ownerId: "user456",
      } as Chat);

      mockChatMembersRepository.isMember.mockResolvedValue(false);

      await expect(messagesService.create(dto)).rejects.toThrow(ForbiddenError);

      expect(mockDatabase.transaction).not.toHaveBeenCalled();
      expect(mockMessagesRepository.createTx).not.toHaveBeenCalled();
    });

    it("should create a reply message when replyToId is provided", async () => {
      const dto = createCreateMessageDto({
        chatId: "chat123",
        senderId: "user123",
        type: MessageType.TEXT,
        body: "Hello world",
        replyToId: "message456",
      });

      const expectedMessage = createMessage({
        id: "message123",
        chatId: "chat123",
        sender: createMessageSender(),
        replyToId: "message456",
      });

      const replyMessage = createMessage({
        id: "message456",
        chatId: "chat123",
        sender: {
          id: "user456",
          userName: "otheruser",
          displayName: "Other User",
          avatarUrl: null,
        },
      });

      mockChatsRepository.findById.mockResolvedValue(createChat());

      mockChatMembersRepository.isMember.mockResolvedValue(true);
      mockMessagesRepository.findById.mockResolvedValue(replyMessage);
      mockMessagesRepository.createTx.mockResolvedValue(expectedMessage);

      const result = await messagesService.create(dto);

      expect(result).toEqual(expectedMessage);
      expect(mockMessagesRepository.findById).toHaveBeenCalledWith("message456");
      expect(mockMessagesRepository.createTx).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          chatId: "chat123",
          senderId: "user123",
          type: MessageType.TEXT,
          body: "Hello world",
          replyToId: "message456",
        }),
      );
      expect(mockMessagesNotificationsService.notifyMessagesCreated).toHaveBeenCalledWith(
        expectedMessage,
        replyMessage,
      );
    });

    it("should throw NotFoundError when reply message does not exist", async () => {
      const dto = createCreateMessageDto({
        chatId: "chat123",
        senderId: "user123",
        type: MessageType.TEXT,
        body: "Hello world",
        replyToId: "nonexistent",
      });

      mockChatsRepository.findById.mockResolvedValue(createChat());

      mockChatMembersRepository.isMember.mockResolvedValue(true);
      mockMessagesRepository.findById.mockResolvedValue(null);

      await expect(messagesService.create(dto)).rejects.toThrow(NotFoundError);

      expect(mockMessagesRepository.createTx).not.toHaveBeenCalled();
    });

    it("should throw ForbiddenError when reply message belongs to another chat", async () => {
      const dto = createCreateMessageDto({
        chatId: "chat123",
        senderId: "user123",
        type: MessageType.TEXT,
        body: "Hello world",
        replyToId: "message456",
      });

      mockChatsRepository.findById.mockResolvedValue(createChat());

      mockChatMembersRepository.isMember.mockResolvedValue(true);
      mockMessagesRepository.findById.mockResolvedValue({
        id: "message456",
        chatId: "different-chat",
        sender: {
          id: "user456",
          userName: "otheruser",
          displayName: "Other User",
          avatarUrl: null,
        },
      } as Message);

      await expect(messagesService.create(dto)).rejects.toThrow(ForbiddenError);

      expect(mockMessagesRepository.createTx).not.toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("should return message when found", async () => {
      const messageId = "message123";
      const userId = "user123";
      const expectedMessage = createMessage({
        id: messageId,
        chatId: "chat123",
        sender: createMessageSender(),
      });

      mockMessagesRepository.findById.mockResolvedValue(expectedMessage);
      mockChatMembersRepository.isMember.mockResolvedValue(true);

      const result = await messagesService.findById(messageId, userId);

      expect(result).toEqual(expectedMessage);
      expect(mockMessagesRepository.findById).toHaveBeenCalledWith(messageId);
      expect(mockChatMembersRepository.isMember).toHaveBeenCalledWith("chat123", userId);
    });

    it("should return null when message is not found", async () => {
      const messageId = "nonexistent";
      const userId = "user123";

      mockMessagesRepository.findById.mockResolvedValue(null);

      const result = await messagesService.findById(messageId, userId);

      expect(result).toBeNull();
      expect(mockMessagesRepository.findById).toHaveBeenCalledWith(messageId);
      expect(mockChatMembersRepository.isMember).not.toHaveBeenCalled();
    });

    it("should throw ForbiddenError when user is not a member of the chat", async () => {
      const messageId = "message123";
      const userId = "user123";
      const message = createMessage({
        id: messageId,
        chatId: "chat123",
        sender: createMessageSender(),
      });

      mockMessagesRepository.findById.mockResolvedValue(message);
      mockChatMembersRepository.isMember.mockResolvedValue(false);

      await expect(messagesService.findById(messageId, userId)).rejects.toThrow(ForbiddenError);

      expect(mockMessagesRepository.findById).toHaveBeenCalledWith(messageId);
      expect(mockChatMembersRepository.isMember).toHaveBeenCalledWith("chat123", userId);
    });
  });

  describe("getMessages", () => {
    it("should load latest messages when mode is LATEST", async () => {
      const chatId = "chat123";
      const currentUserId = "user123";
      const dto = createGetMessagesRequestDto({
        mode: MessagesMode.LATEST,
        limit: 50,
      });

      const member = {
        id: "member123",
        chatId: chatId,
        userId: currentUserId,
        role: ChatMemberRole.MEMBER,
      } as any;

      const messages = [
        createMessage({
          id: "message1",
          chatId: chatId,
          sender: {
            id: "user123",
            userName: "testuser",
            displayName: "Test User",
            avatarUrl: null,
          },
        }),
        createMessage({
          id: "message2",
          chatId: chatId,
          sender: {
            id: "user123",
            userName: "testuser",
            displayName: "Test User",
            avatarUrl: null,
          },
        }),
      ];

      const expectedResult: MessagesPage = {
        messages,
        hasPrevious: false,
        hasNext: false,
      };

      mockChatMembersRepository.findByChatAndUser.mockResolvedValue(member);
      mockMessagesRepository.findLatest.mockResolvedValue(messages);
      mockMessagesRepository.hasMessagesBefore.mockResolvedValue(false);

      const result = await messagesService.getMessages(chatId, currentUserId, dto);

      expect(result).toEqual(expectedResult);
      expect(mockChatMembersRepository.findByChatAndUser).toHaveBeenCalledWith(
        chatId,
        currentUserId,
      );
      expect(mockMessagesRepository.findLatest).toHaveBeenCalledWith(chatId, currentUserId, 50);
      expect(mockMessagesRepository.hasMessagesBefore).toHaveBeenCalledWith(chatId, "message2");
    });

    it("should load messages before when mode is BEFORE", async () => {
      const chatId = "chat123";
      const currentUserId = "user123";
      const dto = createGetMessagesRequestDto({
        mode: MessagesMode.BEFORE,
        limit: 50,
        anchorMessageId: "message456",
      });

      const member = {
        id: "member123",
        chatId: chatId,
        userId: currentUserId,
        role: ChatMemberRole.MEMBER,
      } as any;

      const messages = [
        createMessage({
          id: "message1",
          chatId: chatId,
          sender: {
            id: "user123",
            userName: "testuser",
            displayName: "Test User",
            avatarUrl: null,
          },
        }),
        createMessage({
          id: "message2",
          chatId: chatId,
          sender: {
            id: "user123",
            userName: "testuser",
            displayName: "Test User",
            avatarUrl: null,
          },
        }),
      ];

      const expectedResult: MessagesPage = {
        messages,
        hasPrevious: false,
        hasNext: true,
      };

      mockChatMembersRepository.findByChatAndUser.mockResolvedValue(member);
      mockMessagesRepository.findBefore.mockResolvedValue(messages);
      mockMessagesRepository.hasMessagesBefore.mockResolvedValue(false);

      const result = await messagesService.getMessages(chatId, currentUserId, dto);

      expect(result).toEqual(expectedResult);
      expect(mockChatMembersRepository.findByChatAndUser).toHaveBeenCalledWith(
        chatId,
        currentUserId,
      );
      expect(mockMessagesRepository.findBefore).toHaveBeenCalledWith(
        chatId,
        currentUserId,
        "message456",
        50,
      );
      expect(mockMessagesRepository.hasMessagesBefore).toHaveBeenCalledWith(chatId, "message2");
    });

    it("should throw ValidationError when user is not a member of the chat", async () => {
      const chatId = "chat123";
      const currentUserId = "user123";
      const dto = createGetMessagesRequestDto({
        mode: MessagesMode.LATEST,
        limit: 50,
      });

      mockChatMembersRepository.findByChatAndUser.mockResolvedValue(null);

      await expect(messagesService.getMessages(chatId, currentUserId, dto)).rejects.toThrow(
        ValidationError,
      );

      expect(mockChatMembersRepository.findByChatAndUser).toHaveBeenCalledWith(
        chatId,
        currentUserId,
      );
      expect(mockMessagesRepository.findLatest).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update message successfully when user is the author", async () => {
      const messageId = "message123";
      const userId = "user123";
      const dto = createUpdateMessageRequestDto({
        body: "Updated message",
      });

      const existingMessage = createMessage({
        id: messageId,
        chatId: "chat123",
        sender: {
          id: userId,
          userName: "testuser",
          displayName: "Test User",
          avatarUrl: null,
        },
        isDeleted: false,
      });

      const updatedMessage = createMessage({
        id: messageId,
        chatId: "chat123",
        sender: {
          id: userId,
          userName: "testuser",
          displayName: "Test User",
          avatarUrl: null,
        },
        body: "Updated message",
        isDeleted: false,
      });

      mockMessagesRepository.getByIdOrThrow.mockResolvedValue(existingMessage);
      mockMessagesRepository.update.mockResolvedValue(updatedMessage);

      const result = await messagesService.update(messageId, userId, dto);

      expect(result).toEqual(updatedMessage);
      expect(mockMessagesRepository.getByIdOrThrow).toHaveBeenCalledWith(messageId);
      expect(mockMessagesRepository.update).toHaveBeenCalledWith(messageId, "Updated message");
    });

    it("should throw ForbiddenError when user is not the author", async () => {
      const messageId = "message123";
      const userId = "user123";
      const dto = createUpdateMessageRequestDto({
        body: "Updated message",
      });

      const existingMessage = createMessage({
        id: messageId,
        chatId: "chat123",
        sender: {
          id: "user456", // Different user
          userName: "otheruser",
          displayName: "Other User",
          avatarUrl: null,
        },
        isDeleted: false,
      });

      mockMessagesRepository.getByIdOrThrow.mockResolvedValue(existingMessage);

      await expect(messagesService.update(messageId, userId, dto)).rejects.toThrow(ForbiddenError);

      expect(mockMessagesRepository.getByIdOrThrow).toHaveBeenCalledWith(messageId);
      expect(mockMessagesRepository.update).not.toHaveBeenCalled();
    });

    it("should throw ValidationError when trying to edit a deleted message", async () => {
      const messageId = "message123";
      const userId = "user123";
      const dto = createUpdateMessageRequestDto({
        body: "Updated message",
      });

      const existingMessage = createMessage({
        id: messageId,
        chatId: "chat123",
        sender: {
          id: userId,
          userName: "testuser",
          displayName: "Test User",
          avatarUrl: null,
        },
        isDeleted: true,
      });

      mockMessagesRepository.getByIdOrThrow.mockResolvedValue(existingMessage);

      await expect(messagesService.update(messageId, userId, dto)).rejects.toThrow(ValidationError);

      expect(mockMessagesRepository.getByIdOrThrow).toHaveBeenCalledWith(messageId);
      expect(mockMessagesRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete message successfully when user is the author", async () => {
      const messageId = "message123";
      const userId = "user123";

      const existingMessage = createMessage({
        id: messageId,
        chatId: "chat123",
        sender: {
          id: userId,
          userName: "testuser",
          displayName: "Test User",
          avatarUrl: null,
        },
        isDeleted: false,
      });

      const deletedMessage = createMessage({
        id: messageId,
        chatId: "chat123",
        sender: {
          id: userId,
          userName: "testuser",
          displayName: "Test User",
          avatarUrl: null,
        },
        isDeleted: true,
        deletedAt: new Date(),
      });

      mockMessagesRepository.getByIdOrThrow.mockResolvedValue(existingMessage);
      mockMessagesRepository.delete.mockResolvedValue(deletedMessage);

      const result = await messagesService.delete(messageId, userId);

      expect(result).toEqual(deletedMessage);
      expect(mockMessagesRepository.getByIdOrThrow).toHaveBeenCalledWith(messageId);
      expect(mockMessagesRepository.delete).toHaveBeenCalledWith(messageId);
    });

    it("should return existing message when message is already deleted", async () => {
      const messageId = "message123";
      const userId = "user123";

      const existingMessage = createMessage({
        id: messageId,
        chatId: "chat123",
        sender: {
          id: userId,
          userName: "testuser",
          displayName: "Test User",
          avatarUrl: null,
        },
        isDeleted: true,
        deletedAt: new Date(),
      });

      mockMessagesRepository.getByIdOrThrow.mockResolvedValue(existingMessage);

      const result = await messagesService.delete(messageId, userId);

      expect(result).toEqual(existingMessage);
      expect(mockMessagesRepository.getByIdOrThrow).toHaveBeenCalledWith(messageId);
      expect(mockMessagesRepository.delete).not.toHaveBeenCalled();
    });

    it("should throw ForbiddenError when user is not the author", async () => {
      const messageId = "message123";
      const userId = "user123";

      const existingMessage = createMessage({
        id: messageId,
        chatId: "chat123",
        sender: {
          id: "user456", // Different user
          userName: "otheruser",
          displayName: "Other User",
          avatarUrl: null,
        },
        isDeleted: false,
      });

      mockMessagesRepository.getByIdOrThrow.mockResolvedValue(existingMessage);

      await expect(messagesService.delete(messageId, userId)).rejects.toThrow(ForbiddenError);

      expect(mockMessagesRepository.getByIdOrThrow).toHaveBeenCalledWith(messageId);
      expect(mockMessagesRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe("pinMessage", () => {
    it("should pin message successfully when user is admin", async () => {
      const messageId = "message123";
      const userId = "user123";

      const message = createMessage({
        id: messageId,
        chatId: "chat123",
        sender: createMessageSender(),
      });

      const member = {
        id: "member123",
        chatId: "chat123",
        userId: userId,
        role: ChatMemberRole.ADMIN,
      } as any;

      const pinnedMessage = createMessage({
        id: messageId,
        chatId: "chat123",
        sender: createMessageSender(),
      });

      mockMessagesRepository.getByIdOrThrow.mockResolvedValue(message);
      mockChatMembersRepository.findByChatAndUser.mockResolvedValue(member);
      mockMessagesRepository.pin.mockResolvedValue(pinnedMessage);

      const result = await messagesService.pinMessage(messageId, userId);

      expect(result).toEqual(pinnedMessage);
      expect(mockMessagesRepository.getByIdOrThrow).toHaveBeenCalledWith(messageId);
      expect(mockChatMembersRepository.findByChatAndUser).toHaveBeenCalledWith("chat123", userId);
      expect(mockMessagesRepository.pin).toHaveBeenCalledWith(messageId);
    });

    it("should throw ForbiddenError when user is not admin", async () => {
      const messageId = "message123";
      const userId = "user123";

      const message = createMessage({
        id: messageId,
        chatId: "chat123",
        sender: createMessageSender(),
      });

      const member = {
        id: "member123",
        chatId: "chat123",
        userId: userId,
        role: ChatMemberRole.MEMBER,
      } as any;

      mockMessagesRepository.getByIdOrThrow.mockResolvedValue(message);
      mockChatMembersRepository.findByChatAndUser.mockResolvedValue(member);

      await expect(messagesService.pinMessage(messageId, userId)).rejects.toThrow(ForbiddenError);

      expect(mockMessagesRepository.getByIdOrThrow).toHaveBeenCalledWith(messageId);
      expect(mockChatMembersRepository.findByChatAndUser).toHaveBeenCalledWith("chat123", userId);
      expect(mockMessagesRepository.pin).not.toHaveBeenCalled();
    });
  });

  describe("unpinMessage", () => {
    it("should unpin message successfully when user is admin", async () => {
      const messageId = "message123";
      const userId = "user123";

      const message = createMessage({
        id: messageId,
        chatId: "chat123",
        sender: createMessageSender(),
      });

      const member = {
        id: "member123",
        chatId: "chat123",
        userId: userId,
        role: ChatMemberRole.ADMIN,
      } as any;

      const unpinnedMessage = createMessage({
        id: messageId,
        chatId: "chat123",
        sender: createMessageSender(),
      });

      mockMessagesRepository.getByIdOrThrow.mockResolvedValue(message);
      mockChatMembersRepository.findByChatAndUser.mockResolvedValue(member);
      mockMessagesRepository.unpin.mockResolvedValue(unpinnedMessage);

      const result = await messagesService.unpinMessage(messageId, userId);

      expect(result).toEqual(unpinnedMessage);
      expect(mockMessagesRepository.getByIdOrThrow).toHaveBeenCalledWith(messageId);
      expect(mockChatMembersRepository.findByChatAndUser).toHaveBeenCalledWith("chat123", userId);
      expect(mockMessagesRepository.unpin).toHaveBeenCalledWith(messageId);
    });

    it("should throw ForbiddenError when user is not admin", async () => {
      const messageId = "message123";
      const userId = "user123";

      const message = createMessage({
        id: messageId,
        chatId: "chat123",
        sender: createMessageSender(),
      });

      const member = {
        id: "member123",
        chatId: "chat123",
        userId: userId,
        role: ChatMemberRole.MEMBER,
      } as any;

      mockMessagesRepository.getByIdOrThrow.mockResolvedValue(message);
      mockChatMembersRepository.findByChatAndUser.mockResolvedValue(member);

      await expect(messagesService.unpinMessage(messageId, userId)).rejects.toThrow(ForbiddenError);

      expect(mockMessagesRepository.getByIdOrThrow).toHaveBeenCalledWith(messageId);
      expect(mockChatMembersRepository.findByChatAndUser).toHaveBeenCalledWith("chat123", userId);
      expect(mockMessagesRepository.unpin).not.toHaveBeenCalled();
    });
  });

  describe("findPinnedMessages", () => {
    it("should return pinned messages when user is member", async () => {
      const chatId = "chat123";
      const userId = "user123";

      const messages = [
        createMessage({
          id: "message1",
          chatId: chatId,
          sender: {
            id: "user123",
            userName: "testuser",
            displayName: "Test User",
            avatarUrl: null,
          },
        }),
        createMessage({
          id: "message2",
          chatId: chatId,
          sender: {
            id: "user123",
            userName: "testuser",
            displayName: "Test User",
            avatarUrl: null,
          },
        }),
      ];

      mockChatMembersRepository.isMember.mockResolvedValue(true);
      mockMessagesRepository.findPinned.mockResolvedValue(messages);

      const result = await messagesService.findPinnedMessages(chatId, userId);

      expect(result).toEqual(messages);
      expect(mockChatMembersRepository.isMember).toHaveBeenCalledWith(chatId, userId);
      expect(mockMessagesRepository.findPinned).toHaveBeenCalledWith(chatId, userId);
    });

    it("should throw ForbiddenError when user is not a member", async () => {
      const chatId = "chat123";
      const userId = "user123";

      mockChatMembersRepository.isMember.mockResolvedValue(false);

      await expect(messagesService.findPinnedMessages(chatId, userId)).rejects.toThrow(
        ForbiddenError,
      );

      expect(mockChatMembersRepository.isMember).toHaveBeenCalledWith(chatId, userId);
      expect(mockMessagesRepository.findPinned).not.toHaveBeenCalled();
    });
  });

  describe("search", () => {
    it("should search messages successfully when user is member", async () => {
      const chatId = "chat123";
      const currentUserId = "user123";
      const query = "hello";
      const limit = 30;

      const member = {
        id: "member123",
        chatId: chatId,
        userId: currentUserId,
        role: ChatMemberRole.MEMBER,
      } as any;

      const results = [
        {
          id: "message1",
          chatId: chatId,
          body: "hello world",
          sender: {
            id: "user123",
            userName: "testuser",
            displayName: "Test User",
            avatarUrl: null,
          },
          createdAt: new Date(),
        } as any,
      ];

      mockChatMembersRepository.findByChatAndUser.mockResolvedValue(member);
      mockMessagesSearchRepository.search.mockResolvedValue(results);

      const result = await messagesService.search(chatId, currentUserId, query, limit);

      expect(result).toEqual(results);
      expect(mockChatMembersRepository.findByChatAndUser).toHaveBeenCalledWith(
        chatId,
        currentUserId,
      );
      expect(mockMessagesSearchRepository.search).toHaveBeenCalledWith(chatId, query, limit);
    });

    it("should throw ValidationError when user is not a member", async () => {
      const chatId = "chat123";
      const currentUserId = "user123";
      const query = "hello";
      const limit = 30;

      mockChatMembersRepository.findByChatAndUser.mockResolvedValue(null);

      await expect(messagesService.search(chatId, currentUserId, query, limit)).rejects.toThrow(
        ValidationError,
      );

      expect(mockChatMembersRepository.findByChatAndUser).toHaveBeenCalledWith(
        chatId,
        currentUserId,
      );
      expect(mockMessagesSearchRepository.search).not.toHaveBeenCalled();
    });
  });
});
