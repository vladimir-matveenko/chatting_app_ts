import { describe, expect, beforeEach, jest } from "@jest/globals";

import { AuthService } from "../services/auth.service.js";
import { LoginRequestDto } from "../dto/request/login.request.dto.js";
import { RegisterRequestDto } from "../dto/request/register.request.dto.js";
import { AuthResult } from "../models/auth-result.model.js";
import { User } from "../../users/models/user.model.js";

import type { IUsersRepository } from "../../users/interfaces/users.repository.interface.js";
import type { IRefreshTokensRepository } from "../interfaces/refresh-tokens.repository.interface.js";
import { UsersService } from "../../users/services/users.service.js";

import { JwtService } from "../../../core/security/jwt/index.js";
import { PasswordHasher, TokenHasher } from "../../../core/security/index.js";
import { UnauthorizedError } from "../../../core/errors/index.js";

describe("AuthService", () => {
  let authService: AuthService;

  let mockUsersRepository: jest.Mocked<
    Pick<IUsersRepository, "findCredentialsByEmail" | "findById">
  >;

  let mockRefreshTokensRepository: jest.Mocked<
    Pick<IRefreshTokensRepository, "findByUserId" | "update" | "create" | "delete">
  >;

  let mockUsersService: jest.Mocked<Pick<UsersService, "createUser">>;

  let mockPasswordHasher: jest.Mocked<Pick<PasswordHasher, "compare">>;

  let mockTokenHasher: jest.Mocked<Pick<TokenHasher, "hash">>;

  let mockJwtService: jest.Mocked<
    Pick<JwtService, "signAccessToken" | "signRefreshToken" | "verifyRefreshToken">
  >;

  beforeEach(() => {
    mockUsersRepository = {
      findCredentialsByEmail: jest.fn(),
      findById: jest.fn(),
    };

    mockRefreshTokensRepository = {
      findByUserId: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };

    mockUsersService = {
      createUser: jest.fn(),
    };

    mockPasswordHasher = {
      compare: jest.fn(),
    };

    mockTokenHasher = {
      hash: jest.fn(),
    };

    mockJwtService = {
      signAccessToken: jest.fn(),
      signRefreshToken: jest.fn(),
      verifyRefreshToken: jest.fn(),
    };

    authService = new AuthService(
      mockUsersRepository as unknown as IUsersRepository,
      mockRefreshTokensRepository as unknown as IRefreshTokensRepository,
      mockUsersService as unknown as UsersService,
      mockPasswordHasher as unknown as PasswordHasher,
      mockTokenHasher as unknown as TokenHasher,
      mockJwtService as unknown as JwtService,
    );
  });

  describe("login", () => {
    it("should login successfully with valid credentials", async () => {
      const loginDto: LoginRequestDto = {
        email: "test@example.com",
        password: "password123",
      };

      const mockCredentials = {
        id: "user123",
        email: "test@example.com",
        passwordHash: "hashedPassword",
      };

      const mockUser: User = {
        id: "user123",
        email: "test@example.com",
        userName: "testuser",
        displayName: null,
        avatarUrl: null,
        avatarPublicId: null,
        passwordHash: "hashedPassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockAuthResult: AuthResult = {
        accessToken: "access-token-123",
        refreshToken: "refresh-token-123",
        user: mockUser,
      };

      mockUsersRepository.findCredentialsByEmail.mockResolvedValue(mockCredentials);

      mockPasswordHasher.compare.mockResolvedValue(true);

      mockUsersRepository.findById.mockResolvedValue(mockUser);

      mockJwtService.signAccessToken.mockReturnValue("access-token-123");

      mockJwtService.signRefreshToken.mockReturnValue("refresh-token-123");

      mockTokenHasher.hash.mockReturnValue("hashed-refresh-token");

      mockRefreshTokensRepository.findByUserId.mockResolvedValue(null);

      mockRefreshTokensRepository.create.mockResolvedValue({
        userId: "user123",
        tokenHash: "hashed-refresh-token",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await authService.login(loginDto);

      expect(result).toEqual(mockAuthResult);

      expect(mockUsersRepository.findCredentialsByEmail).toHaveBeenCalledWith(loginDto.email);

      expect(mockPasswordHasher.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockCredentials.passwordHash,
      );

      expect(mockUsersRepository.findById).toHaveBeenCalledWith(mockCredentials.id);

      expect(mockJwtService.signAccessToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        email: mockUser.email,
      });

      expect(mockJwtService.signRefreshToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        email: mockUser.email,
      });

      expect(mockTokenHasher.hash).toHaveBeenCalledWith("refresh-token-123");

      expect(mockRefreshTokensRepository.findByUserId).toHaveBeenCalledWith(mockUser.id);

      expect(mockRefreshTokensRepository.create).toHaveBeenCalledWith(
        mockUser.id,
        "hashed-refresh-token",
        expect.any(Date),
      );
    });

    it("should throw UnauthorizedError for invalid email", async () => {
      const loginDto: LoginRequestDto = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      mockUsersRepository.findCredentialsByEmail.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedError);

      expect(mockUsersRepository.findCredentialsByEmail).toHaveBeenCalledWith(loginDto.email);

      expect(mockPasswordHasher.compare).not.toHaveBeenCalled();
      expect(mockUsersRepository.findById).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedError for invalid password", async () => {
      const loginDto: LoginRequestDto = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      const mockCredentials = {
        id: "user123",
        email: "test@example.com",
        passwordHash: "hashedPassword",
      };

      mockUsersRepository.findCredentialsByEmail.mockResolvedValue(mockCredentials);

      mockPasswordHasher.compare.mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedError);

      expect(mockPasswordHasher.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockCredentials.passwordHash,
      );

      expect(mockUsersRepository.findById).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedError when user is not found after valid credentials", async () => {
      const loginDto: LoginRequestDto = {
        email: "test@example.com",
        password: "password123",
      };

      const mockCredentials = {
        id: "user123",
        email: "test@example.com",
        passwordHash: "hashedPassword",
      };

      mockUsersRepository.findCredentialsByEmail.mockResolvedValue(mockCredentials);

      mockPasswordHasher.compare.mockResolvedValue(true);

      mockUsersRepository.findById.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedError);

      expect(mockUsersRepository.findById).toHaveBeenCalledWith(mockCredentials.id);
    });
  });

  describe("register", () => {
    it("should register successfully", async () => {
      const registerDto: RegisterRequestDto = {
        userName: "newuser",
        email: "newuser@example.com",
        password: "password123",
      };

      const mockUser: User = {
        id: "user123",
        email: "newuser@example.com",
        userName: "newuser",
        displayName: null,
        avatarUrl: null,
        avatarPublicId: null,
        passwordHash: "hashedPassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockAuthResult: AuthResult = {
        accessToken: "access-token-123",
        refreshToken: "refresh-token-123",
        user: mockUser,
      };

      mockUsersService.createUser.mockResolvedValue(mockUser);

      mockJwtService.signAccessToken.mockReturnValue("access-token-123");

      mockJwtService.signRefreshToken.mockReturnValue("refresh-token-123");

      mockTokenHasher.hash.mockReturnValue("hashed-refresh-token");

      mockRefreshTokensRepository.findByUserId.mockResolvedValue(null);

      mockRefreshTokensRepository.create.mockResolvedValue({
        userId: "user123",
        tokenHash: "hashed-refresh-token",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await authService.register(registerDto);

      expect(result).toEqual(mockAuthResult);

      expect(mockUsersService.createUser).toHaveBeenCalledWith(registerDto);

      expect(mockJwtService.signAccessToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        email: mockUser.email,
      });

      expect(mockJwtService.signRefreshToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        email: mockUser.email,
      });

      expect(mockRefreshTokensRepository.create).toHaveBeenCalledWith(
        mockUser.id,
        "hashed-refresh-token",
        expect.any(Date),
      );
    });
  });

  describe("refresh", () => {
    it("should refresh tokens successfully", async () => {
      const refreshToken = "valid-refresh-token";

      const payload = {
        userId: "user123",
        email: "test@example.com",
      };

      const mockStoredToken = {
        userId: "user123",
        tokenHash: "hashed-refresh-token",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUser: User = {
        id: "user123",
        email: "test@example.com",
        userName: "testuser",
        displayName: null,
        avatarUrl: null,
        avatarPublicId: null,
        passwordHash: "hashedPassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockAuthResult: AuthResult = {
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
        user: mockUser,
      };

      mockJwtService.verifyRefreshToken.mockReturnValue(payload);

      mockRefreshTokensRepository.findByUserId.mockResolvedValue(mockStoredToken);

      mockTokenHasher.hash
        .mockReturnValueOnce("hashed-refresh-token")
        .mockReturnValueOnce("hashed-new-refresh-token");

      mockUsersRepository.findById.mockResolvedValue(mockUser);

      mockJwtService.signAccessToken.mockReturnValue("new-access-token");

      mockJwtService.signRefreshToken.mockReturnValue("new-refresh-token");

      mockRefreshTokensRepository.update.mockResolvedValue({
        userId: "user123",
        tokenHash: "hashed-new-refresh-token",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await authService.refresh(refreshToken);

      expect(result).toEqual(mockAuthResult);

      expect(mockJwtService.verifyRefreshToken).toHaveBeenCalledWith(refreshToken);

      expect(mockRefreshTokensRepository.findByUserId).toHaveBeenCalledWith(payload.userId);

      expect(mockTokenHasher.hash).toHaveBeenCalledWith(refreshToken);

      expect(mockUsersRepository.findById).toHaveBeenCalledWith(payload.userId);

      expect(mockJwtService.signAccessToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        email: mockUser.email,
      });

      expect(mockJwtService.signRefreshToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        email: mockUser.email,
      });

      expect(mockRefreshTokensRepository.update).toHaveBeenCalledWith(
        mockUser.id,
        "hashed-new-refresh-token",
        expect.any(Date),
      );

      expect(mockRefreshTokensRepository.create).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedError when refresh token is not found", async () => {
      const refreshToken = "invalid-refresh-token";

      const payload = {
        userId: "user123",
        email: "test@example.com",
      };

      mockJwtService.verifyRefreshToken.mockReturnValue(payload);

      mockRefreshTokensRepository.findByUserId.mockResolvedValue(null);

      await expect(authService.refresh(refreshToken)).rejects.toThrow(UnauthorizedError);

      expect(mockRefreshTokensRepository.findByUserId).toHaveBeenCalledWith(payload.userId);

      expect(mockTokenHasher.hash).not.toHaveBeenCalled();
      expect(mockUsersRepository.findById).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedError when refresh token is expired", async () => {
      const refreshToken = "expired-refresh-token";

      const payload = {
        userId: "user123",
        email: "test@example.com",
      };

      const expiredToken = {
        userId: "user123",
        tokenHash: "hashed-refresh-token",
        expiresAt: new Date(Date.now() - 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockJwtService.verifyRefreshToken.mockReturnValue(payload);

      mockRefreshTokensRepository.findByUserId.mockResolvedValue(expiredToken);

      await expect(authService.refresh(refreshToken)).rejects.toThrow(UnauthorizedError);

      expect(mockTokenHasher.hash).not.toHaveBeenCalled();
      expect(mockUsersRepository.findById).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedError when refresh token hash is invalid", async () => {
      const refreshToken = "invalid-refresh-token";

      const payload = {
        userId: "user123",
        email: "test@example.com",
      };

      const storedToken = {
        userId: "user123",
        tokenHash: "different-hash",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockJwtService.verifyRefreshToken.mockReturnValue(payload);

      mockRefreshTokensRepository.findByUserId.mockResolvedValue(storedToken);

      mockTokenHasher.hash.mockReturnValue("hashed-refresh-token");

      await expect(authService.refresh(refreshToken)).rejects.toThrow(UnauthorizedError);

      expect(mockTokenHasher.hash).toHaveBeenCalledWith(refreshToken);

      expect(mockUsersRepository.findById).not.toHaveBeenCalled();
      expect(mockRefreshTokensRepository.update).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedError when user is not found", async () => {
      const refreshToken = "valid-refresh-token";

      const payload = {
        userId: "user123",
        email: "test@example.com",
      };

      const storedToken = {
        userId: "user123",
        tokenHash: "hashed-refresh-token",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockJwtService.verifyRefreshToken.mockReturnValue(payload);

      mockRefreshTokensRepository.findByUserId.mockResolvedValue(storedToken);

      mockTokenHasher.hash
        .mockReturnValueOnce("hashed-refresh-token")
        .mockReturnValueOnce("hashed-new-refresh-token");

      mockUsersRepository.findById.mockResolvedValue(null);

      mockJwtService.signAccessToken.mockReturnValue("new-access-token");

      mockJwtService.signRefreshToken.mockReturnValue("new-refresh-token");

      await expect(authService.refresh(refreshToken)).rejects.toThrow(UnauthorizedError);

      expect(mockUsersRepository.findById).toHaveBeenCalledWith(payload.userId);

      expect(mockJwtService.signAccessToken).not.toHaveBeenCalled();
      expect(mockJwtService.signRefreshToken).not.toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("should logout successfully", async () => {
      const userId = "user123";

      await authService.logout(userId);

      expect(mockRefreshTokensRepository.delete).toHaveBeenCalledWith(userId);
    });
  });
});
