import { describe, expect, beforeEach, jest } from "@jest/globals";

import { UsersService } from "../services/users.service.js";
import type { IUsersRepository } from "../interfaces/users.repository.interface.js";
import type { IUserListRepository } from "../interfaces/user-list.repository.interface.js";
import type { IRefreshTokensRepository } from "../../auth/interfaces/refresh-tokens.repository.interface.js";
import type { PasswordHasher } from "../../../core/security/password/index.js";
import type { FileStorage } from "../../../core/storage/file-storage.interface.js";

import { User } from "../models/user.model.js";
import { UserListItem } from "../models/user-list-item.model.js";
import { CreateUserRequestDto } from "../dto/request/create-user.request.dto.js";
import { UpdateUserDto } from "../dto/update-user.dto.js";
import { UpdatePasswordDto } from "../dto/update-password.dto.js";
import { FindUsersDto } from "../dto/find-users.dto.js";

import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} from "../../../core/errors/index.js";

describe("UsersService", () => {
  let usersService: UsersService;

  let mockUsersRepository: jest.Mocked<
    Pick<
      IUsersRepository,
      | "create"
      | "findById"
      | "findByEmail"
      | "findByUsername"
      | "update"
      | "updatePassword"
      | "findCredentialsById"
      | "updateAvatar"
    >
  >;

  let mockUserListRepository: jest.Mocked<Pick<IUserListRepository, "search">>;

  let mockRefreshTokensRepository: jest.Mocked<Pick<IRefreshTokensRepository, "delete">>;

  let mockPasswordHasher: jest.Mocked<Pick<PasswordHasher, "hash" | "compare">>;

  let mockFileStorage: jest.Mocked<Pick<FileStorage, "save" | "delete">>;

  /*
   * Minimal valid 1x1 PNG.
   *
   * We use a real image instead of mocking detectImageType.
   * This keeps the test compatible with the current ESM/Jest setup
   * without requiring top-level await or unstable_mockModule.
   */
  const validPng = Buffer.from(
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c6360000000020001e221bc330000000049454e44ae426082",
    "hex",
  );

  const createUser = (overrides: Partial<User> = {}): User => ({
    id: "user123",
    email: "user@example.com",
    userName: "Test User",
    displayName: null,
    avatarUrl: null,
    avatarPublicId: null,
    passwordHash: "hashedPassword",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  const createCredentials = () => ({
    id: "user123",
    email: "user@example.com",
    passwordHash: "hashedOldPassword",
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockUsersRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      update: jest.fn(),
      updatePassword: jest.fn(),
      findCredentialsById: jest.fn(),
      updateAvatar: jest.fn(),
    };

    mockUserListRepository = {
      search: jest.fn(),
    };

    mockRefreshTokensRepository = {
      delete: jest.fn(),
    };

    mockPasswordHasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    mockFileStorage = {
      save: jest.fn(),
      delete: jest.fn(),
    };

    usersService = new UsersService(
      mockUsersRepository as unknown as IUsersRepository,
      mockUserListRepository as unknown as IUserListRepository,
      mockRefreshTokensRepository as unknown as IRefreshTokensRepository,
      mockPasswordHasher as unknown as PasswordHasher,
      mockFileStorage as unknown as FileStorage,
    );
  });

  describe("createUser", () => {
    it("should create a new user successfully", async () => {
      const createUserDto: CreateUserRequestDto = {
        email: "newuser@example.com",
        password: "securePassword123",
        userName: "New User",
      };

      const expectedUser = createUser({
        email: "newuser@example.com",
        userName: "New User",
        passwordHash: "hashedPassword",
      });

      mockUsersRepository.findByEmail.mockResolvedValue(null);
      mockUsersRepository.findByUsername.mockResolvedValue(null);
      mockPasswordHasher.hash.mockResolvedValue("hashedPassword");
      mockUsersRepository.create.mockResolvedValue(expectedUser);

      const result = await usersService.createUser(createUserDto);

      expect(result).toEqual(expectedUser);

      expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(createUserDto.email);

      expect(mockUsersRepository.findByUsername).toHaveBeenCalledWith(createUserDto.userName);

      expect(mockPasswordHasher.hash).toHaveBeenCalledWith(createUserDto.password);

      expect(mockUsersRepository.create).toHaveBeenCalledWith({
        userName: createUserDto.userName,
        email: createUserDto.email,
        passwordHash: "hashedPassword",
      });
    });

    it("should throw ConflictError when email already exists", async () => {
      const createUserDto: CreateUserRequestDto = {
        email: "existing@example.com",
        password: "password",
        userName: "New User",
      };

      mockUsersRepository.findByEmail.mockResolvedValue(
        createUser({
          id: "user456",
          email: "existing@example.com",
        }),
      );

      await expect(usersService.createUser(createUserDto)).rejects.toThrow(ConflictError);

      expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(createUserDto.email);

      expect(mockPasswordHasher.hash).not.toHaveBeenCalled();
      expect(mockUsersRepository.create).not.toHaveBeenCalled();
    });

    it("should throw ConflictError when username already exists", async () => {
      const createUserDto: CreateUserRequestDto = {
        email: "newuser@example.com",
        password: "password",
        userName: "existinguser",
      };

      mockUsersRepository.findByEmail.mockResolvedValue(null);

      mockUsersRepository.findByUsername.mockResolvedValue(
        createUser({
          id: "user456",
          userName: "existinguser",
        }),
      );

      await expect(usersService.createUser(createUserDto)).rejects.toThrow(ConflictError);

      expect(mockUsersRepository.findByUsername).toHaveBeenCalledWith(createUserDto.userName);

      expect(mockPasswordHasher.hash).not.toHaveBeenCalled();
      expect(mockUsersRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("should return user when found", async () => {
      const userId = "user123";
      const expectedUser = createUser();

      mockUsersRepository.findById.mockResolvedValue(expectedUser);

      const result = await usersService.findById(userId);

      expect(result).toEqual(expectedUser);
      expect(mockUsersRepository.findById).toHaveBeenCalledWith(userId);
    });

    it("should throw NotFoundError when user not found", async () => {
      const userId = "nonexistent";

      mockUsersRepository.findById.mockResolvedValue(null);

      await expect(usersService.findById(userId)).rejects.toThrow(NotFoundError);

      expect(mockUsersRepository.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe("getByEmail", () => {
    it("should return user when found by email", async () => {
      const email = "user@example.com";
      const expectedUser = createUser({ email });

      mockUsersRepository.findByEmail.mockResolvedValue(expectedUser);

      const result = await usersService.getByEmail(email);

      expect(result).toEqual(expectedUser);
      expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(email);
    });

    it("should throw NotFoundError when user not found by email", async () => {
      const email = "nonexistent@example.com";

      mockUsersRepository.findByEmail.mockResolvedValue(null);

      await expect(usersService.getByEmail(email)).rejects.toThrow(NotFoundError);

      expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe("getByUsername", () => {
    it("should return user when found by username", async () => {
      const userName = "testuser";
      const expectedUser = createUser({ userName });

      mockUsersRepository.findByUsername.mockResolvedValue(expectedUser);

      const result = await usersService.getByUsername(userName);

      expect(result).toEqual(expectedUser);
      expect(mockUsersRepository.findByUsername).toHaveBeenCalledWith(userName);
    });

    it("should throw NotFoundError when user not found by username", async () => {
      const userName = "nonexistent";

      mockUsersRepository.findByUsername.mockResolvedValue(null);

      await expect(usersService.getByUsername(userName)).rejects.toThrow(NotFoundError);

      expect(mockUsersRepository.findByUsername).toHaveBeenCalledWith(userName);
    });
  });

  describe("update", () => {
    it("should update user successfully", async () => {
      const userId = "user123";

      const updateDto: UpdateUserDto = {
        email: "updated@example.com",
        userName: "Updated User",
      };

      const existingUser = createUser();

      const updatedUser = createUser({
        email: "updated@example.com",
        userName: "Updated User",
      });

      mockUsersRepository.findById.mockResolvedValue(existingUser);
      mockUsersRepository.findByEmail.mockResolvedValue(null);
      mockUsersRepository.findByUsername.mockResolvedValue(null);
      mockUsersRepository.update.mockResolvedValue(updatedUser);

      const result = await usersService.update(userId, updateDto);

      expect(result).toEqual(updatedUser);

      expect(mockUsersRepository.findById).toHaveBeenCalledWith(userId);

      expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(updateDto.email!);

      expect(mockUsersRepository.findByUsername).toHaveBeenCalledWith(updateDto.userName!);

      expect(mockUsersRepository.update).toHaveBeenCalledWith(userId, updateDto);
    });

    it("should throw NotFoundError when user not found", async () => {
      const userId = "nonexistent";

      const updateDto: UpdateUserDto = {
        email: "updated@example.com",
        userName: "Updated User",
      };

      mockUsersRepository.findById.mockResolvedValue(null);

      await expect(usersService.update(userId, updateDto)).rejects.toThrow(NotFoundError);

      expect(mockUsersRepository.update).not.toHaveBeenCalled();
    });

    it("should throw ConflictError when email is already taken by another user", async () => {
      const userId = "user123";

      const updateDto: UpdateUserDto = {
        email: "taken@example.com",
        userName: "Updated User",
      };

      mockUsersRepository.findById.mockResolvedValue(createUser());

      mockUsersRepository.findByEmail.mockResolvedValue(
        createUser({
          id: "user456",
          email: "taken@example.com",
        }),
      );

      await expect(usersService.update(userId, updateDto)).rejects.toThrow(ConflictError);

      expect(mockUsersRepository.update).not.toHaveBeenCalled();
    });

    it("should throw ConflictError when username is already taken by another user", async () => {
      const userId = "user123";

      const updateDto: UpdateUserDto = {
        email: "updated@example.com",
        userName: "takenuser",
      };

      mockUsersRepository.findById.mockResolvedValue(createUser());
      mockUsersRepository.findByEmail.mockResolvedValue(null);

      mockUsersRepository.findByUsername.mockResolvedValue(
        createUser({
          id: "user456",
          userName: "takenuser",
        }),
      );

      await expect(usersService.update(userId, updateDto)).rejects.toThrow(ConflictError);

      expect(mockUsersRepository.update).not.toHaveBeenCalled();
    });

    it("should allow updating with same email", async () => {
      const userId = "user123";

      const updateDto: UpdateUserDto = {
        email: "user@example.com",
        userName: "Updated User",
      };

      const existingUser = createUser();

      const updatedUser = createUser({
        userName: "Updated User",
      });

      mockUsersRepository.findById.mockResolvedValue(existingUser);
      mockUsersRepository.findByUsername.mockResolvedValue(null);
      mockUsersRepository.update.mockResolvedValue(updatedUser);

      const result = await usersService.update(userId, updateDto);

      expect(result).toEqual(updatedUser);
      expect(mockUsersRepository.findByEmail).not.toHaveBeenCalled();
    });

    it("should allow updating with same username", async () => {
      const userId = "user123";

      const updateDto: UpdateUserDto = {
        email: "updated@example.com",
        userName: "Test User",
      };

      const existingUser = createUser();

      const updatedUser = createUser({
        email: "updated@example.com",
      });

      mockUsersRepository.findById.mockResolvedValue(existingUser);
      mockUsersRepository.findByEmail.mockResolvedValue(null);
      mockUsersRepository.update.mockResolvedValue(updatedUser);

      const result = await usersService.update(userId, updateDto);

      expect(result).toEqual(updatedUser);
      expect(mockUsersRepository.findByUsername).not.toHaveBeenCalled();
    });
  });

  describe("updatePassword", () => {
    it("should update password successfully", async () => {
      const userId = "user123";

      const updatePasswordDto: UpdatePasswordDto = {
        currentPassword: "oldPassword",
        newPassword: "newPassword123",
      };

      const credentials = createCredentials();

      const updatedUser = createUser({
        passwordHash: "hashedNewPassword",
      });

      mockUsersRepository.findCredentialsById.mockResolvedValue(credentials);

      mockPasswordHasher.compare.mockResolvedValueOnce(true).mockResolvedValueOnce(false);

      mockPasswordHasher.hash.mockResolvedValue("hashedNewPassword");

      mockUsersRepository.updatePassword.mockResolvedValue(updatedUser);

      const result = await usersService.updatePassword(userId, updatePasswordDto);

      expect(result).toEqual(updatedUser);

      expect(mockUsersRepository.findCredentialsById).toHaveBeenCalledWith(userId);

      expect(mockPasswordHasher.compare).toHaveBeenNthCalledWith(
        1,
        updatePasswordDto.currentPassword,
        credentials.passwordHash,
      );

      expect(mockPasswordHasher.compare).toHaveBeenNthCalledWith(
        2,
        updatePasswordDto.newPassword,
        credentials.passwordHash,
      );

      expect(mockPasswordHasher.hash).toHaveBeenCalledWith(updatePasswordDto.newPassword);

      expect(mockUsersRepository.updatePassword).toHaveBeenCalledWith(userId, "hashedNewPassword");

      expect(mockRefreshTokensRepository.delete).toHaveBeenCalledWith(userId);
    });

    it("should throw NotFoundError when user not found", async () => {
      const userId = "nonexistent";

      const updatePasswordDto: UpdatePasswordDto = {
        currentPassword: "oldPassword",
        newPassword: "newPassword123",
      };

      mockUsersRepository.findCredentialsById.mockResolvedValue(null);

      await expect(usersService.updatePassword(userId, updatePasswordDto)).rejects.toThrow(
        NotFoundError,
      );

      expect(mockPasswordHasher.compare).not.toHaveBeenCalled();
      expect(mockUsersRepository.updatePassword).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedError when current password is incorrect", async () => {
      const userId = "user123";

      const updatePasswordDto: UpdatePasswordDto = {
        currentPassword: "wrongPassword",
        newPassword: "newPassword123",
      };

      const credentials = createCredentials();

      mockUsersRepository.findCredentialsById.mockResolvedValue(credentials);
      mockPasswordHasher.compare.mockResolvedValue(false);

      await expect(usersService.updatePassword(userId, updatePasswordDto)).rejects.toThrow(
        UnauthorizedError,
      );

      expect(mockPasswordHasher.compare).toHaveBeenCalledWith(
        updatePasswordDto.currentPassword,
        credentials.passwordHash,
      );

      expect(mockPasswordHasher.hash).not.toHaveBeenCalled();
      expect(mockUsersRepository.updatePassword).not.toHaveBeenCalled();
    });

    it("should throw BadRequestError when new password is same as current", async () => {
      const userId = "user123";

      const updatePasswordDto: UpdatePasswordDto = {
        currentPassword: "samePassword",
        newPassword: "samePassword",
      };

      const credentials = createCredentials();

      mockUsersRepository.findCredentialsById.mockResolvedValue(credentials);

      mockPasswordHasher.compare.mockResolvedValueOnce(true).mockResolvedValueOnce(true);

      await expect(usersService.updatePassword(userId, updatePasswordDto)).rejects.toThrow(
        BadRequestError,
      );

      expect(mockPasswordHasher.hash).not.toHaveBeenCalled();
      expect(mockUsersRepository.updatePassword).not.toHaveBeenCalled();
    });
  });

  describe("search", () => {
    it("should search users successfully", async () => {
      const currentUserId = "user123";

      const findUsersDto: FindUsersDto = {
        query: "test",
        limit: 20,
        offset: 0,
      };

      const expectedUsers: UserListItem[] = [
        {
          id: "user456",
          userName: "testuser1",
          displayName: "Test User 1",
          avatarUrl: null,
          privateChatId: null,
        },
        {
          id: "user789",
          userName: "testuser2",
          displayName: "Test User 2",
          avatarUrl: null,
          privateChatId: null,
        },
      ];

      mockUserListRepository.search.mockResolvedValue(expectedUsers);

      const result = await usersService.search(currentUserId, findUsersDto);

      expect(result).toEqual(expectedUsers);

      expect(mockUserListRepository.search).toHaveBeenCalledWith(currentUserId, findUsersDto);
    });
  });

  describe("uploadAvatar", () => {
    it("should upload avatar successfully", async () => {
      const userId = "user123";

      const existingUser = createUser();

      const updatedUser = createUser({
        avatarUrl: "https://res.cloudinary.com/demo/image/upload/v123/avatars/uuid.png",
        avatarPublicId: "avatars/uuid",
      });

      mockUsersRepository.findById.mockResolvedValue(existingUser);
      mockFileStorage.save.mockResolvedValue({
        url: "https://res.cloudinary.com/demo/image/upload/v123/avatars/uuid.png",
        publicId: "avatars/uuid",
      });
      mockUsersRepository.updateAvatar.mockResolvedValue(updatedUser);

      const result = await usersService.uploadAvatar(userId, validPng);

      expect(result).toEqual(updatedUser);

      expect(mockUsersRepository.findById).toHaveBeenCalledWith(userId);

      expect(mockFileStorage.save).toHaveBeenCalled();

      expect(mockUsersRepository.updateAvatar).toHaveBeenCalledWith(
        userId,
        "https://res.cloudinary.com/demo/image/upload/v123/avatars/uuid.png",
        "avatars/uuid",
      );
    });

    it("should throw NotFoundError when user not found", async () => {
      const userId = "nonexistent";

      mockUsersRepository.findById.mockResolvedValue(null);

      await expect(usersService.uploadAvatar(userId, validPng)).rejects.toThrow(NotFoundError);

      expect(mockFileStorage.save).not.toHaveBeenCalled();
    });

    it("should throw BadRequestError for invalid image format", async () => {
      const userId = "user123";

      const invalidFile = Buffer.from("fake-data");

      await expect(usersService.uploadAvatar(userId, invalidFile)).rejects.toThrow(BadRequestError);

      expect(mockUsersRepository.findById).not.toHaveBeenCalled();
      expect(mockFileStorage.save).not.toHaveBeenCalled();
    });

    it("should delete old avatar when uploading new one", async () => {
      const userId = "user123";

      const existingUser = createUser({
        avatarUrl: "https://res.cloudinary.com/demo/image/upload/v123/avatars/old-avatar.png",
        avatarPublicId: "avatars/old-avatar",
      });

      const updatedUser = createUser({
        avatarUrl: "https://res.cloudinary.com/demo/image/upload/v123/avatars/new-avatar.png",
        avatarPublicId: "avatars/new-avatar",
      });

      mockUsersRepository.findById.mockResolvedValue(existingUser);
      mockFileStorage.save.mockResolvedValue({
        url: "https://res.cloudinary.com/demo/image/upload/v123/avatars/new-avatar.png",
        publicId: "avatars/new-avatar",
      });
      mockUsersRepository.updateAvatar.mockResolvedValue(updatedUser);

      const result = await usersService.uploadAvatar(userId, validPng);

      expect(result).toEqual(updatedUser);

      expect(mockFileStorage.delete).toHaveBeenCalledWith("avatars/old-avatar");
    });

    it("should delete uploaded file on updateAvatar failure", async () => {
      const userId = "user123";

      const existingUser = createUser();

      mockUsersRepository.findById.mockResolvedValue(existingUser);

      mockFileStorage.save.mockResolvedValue({
        url: "https://res.cloudinary.com/demo/image/upload/v123/avatars/uuid.png",
        publicId: "avatars/uuid",
      });

      mockUsersRepository.updateAvatar.mockRejectedValue(new Error("Database error"));

      await expect(usersService.uploadAvatar(userId, validPng)).rejects.toThrow("Database error");

      expect(mockFileStorage.delete).toHaveBeenCalledWith("avatars/uuid");
    });
  });

  describe("deleteAvatar", () => {
    it("should delete avatar successfully", async () => {
      const userId = "user123";

      const existingUser = createUser({
        avatarUrl: "https://res.cloudinary.com/demo/image/upload/v123/avatars/avatar.png",
        avatarPublicId: "avatars/avatar",
      });

      mockUsersRepository.findById.mockResolvedValue(existingUser);

      mockUsersRepository.updateAvatar.mockResolvedValue({
        ...existingUser,
        avatarUrl: null,
        avatarPublicId: null,
      });

      await usersService.deleteAvatar(userId);

      expect(mockUsersRepository.findById).toHaveBeenCalledWith(userId);

      expect(mockUsersRepository.updateAvatar).toHaveBeenCalledWith(userId, null, null);

      expect(mockFileStorage.delete).toHaveBeenCalledWith("avatars/avatar");
    });

    it("should do nothing when user has no avatar", async () => {
      const userId = "user123";

      const existingUser = createUser({
        avatarUrl: null,
      });

      mockUsersRepository.findById.mockResolvedValue(existingUser);

      await usersService.deleteAvatar(userId);

      expect(mockUsersRepository.updateAvatar).not.toHaveBeenCalled();
      expect(mockFileStorage.delete).not.toHaveBeenCalled();
    });

    it("should throw NotFoundError when user not found", async () => {
      const userId = "nonexistent";

      mockUsersRepository.findById.mockResolvedValue(null);

      await expect(usersService.deleteAvatar(userId)).rejects.toThrow(NotFoundError);

      expect(mockUsersRepository.updateAvatar).not.toHaveBeenCalled();
    });
  });
});
