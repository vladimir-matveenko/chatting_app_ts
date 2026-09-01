import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../../core/errors/index.js";

import type { CreateUserRequestDto } from "../dto/request/create-user.request.dto.js";

import type { CreateUserDto } from "../dto/create-user.dto.js";

import type { IUsersRepository } from "../interfaces/users.repository.interface.js";

import type { User } from "../models/user.model.js";
import { PasswordHasher } from "../../../core/security/password/index.js";
import { UpdateUserDto } from "../dto/update-user.dto.js";
import { UpdatePasswordDto } from "../dto/update-password.dto.js";
import { IRefreshTokensRepository } from "../../auth/interfaces/refresh-tokens.repository.interface.js";
import { FindUsersDto } from "../dto/find-users.dto.js";
import { UserListItem } from "../models/user-list-item.model.js";
import { IUserListRepository } from "../interfaces/user-list.repository.interface.js";
import { FileStorage } from "../../../core/storage/file-storage.interface.js";
import { detectImageType } from "../../../core/storage/image-file.utils.js";
import { logger } from "../../../core/logger/logger.js";

export class UsersService {
  constructor(
    private readonly usersRepository: IUsersRepository,

    private readonly userListRepository: IUserListRepository,

    private readonly refreshTokensRepository: IRefreshTokensRepository,

    private readonly passwordHasher: PasswordHasher,

    private readonly fileStorage: FileStorage,
  ) {}

  async createUser(dto: CreateUserRequestDto): Promise<User> {
    await this.ensureEmailIsUnique(dto.email);

    await this.ensureUsernameIsUnique(dto.userName);

    const passwordHash = await this.passwordHasher.hash(dto.password);

    const createDto: CreateUserDto = {
      userName: dto.userName,

      email: dto.email,

      passwordHash,
    };

    return this.usersRepository.create(createDto);
  }

  async findById(id: string): Promise<User> {
    return this.requireById(id);
  }

  async requireById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundError("User not found.", "USER_NOT_FOUND");
    }

    return user;
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundError("User not found.", "USER_NOT_FOUND");
    }

    return user;
  }

  async getByUsername(userName: string): Promise<User> {
    const user = await this.usersRepository.findByUsername(userName);

    if (!user) {
      throw new NotFoundError("User not found.", "USER_NOT_FOUND");
    }

    return user;
  }

  private async ensureEmailIsUnique(email: string): Promise<void> {
    const exists = await this.usersRepository.findByEmail(email);

    if (exists) {
      throw new ConflictError("Email already exists.", "EMAIL_ALREADY_EXISTS");
    }
  }

  private async ensureUsernameIsUnique(userName: string): Promise<void> {
    const exists = await this.usersRepository.findByUsername(userName);

    if (exists) {
      throw new ConflictError("Username already exists.", "USERNAME_ALREADY_EXISTS");
    }
  }

  async update(
    id: string,

    dto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.requireById(id);

    await this.ensureEmailIsAvailable(
      dto.email,

      user.email,
    );

    await this.ensureUsernameIsAvailable(
      dto.userName,

      user.userName,
    );

    return this.usersRepository.update(
      id,

      dto,
    );
  }

  private async ensureEmailIsAvailable(
    newEmail: string | undefined,

    currentEmail: string,
  ): Promise<void> {
    if (newEmail === undefined || newEmail === currentEmail) {
      return;
    }

    const existing = await this.usersRepository.findByEmail(newEmail);

    if (existing) {
      throw new ConflictError(
        "Email already exists.",

        "EMAIL_ALREADY_EXISTS",
      );
    }
  }

  private async ensureUsernameIsAvailable(
    newUsername: string | undefined,

    currentUsername: string,
  ): Promise<void> {
    if (newUsername === undefined || newUsername === currentUsername) {
      return;
    }

    const existing = await this.usersRepository.findByUsername(newUsername);

    if (existing) {
      throw new ConflictError(
        "Username already exists.",

        "USERNAME_ALREADY_EXISTS",
      );
    }
  }

  async updatePassword(
    id: string,

    dto: UpdatePasswordDto,
  ): Promise<User> {
    const credentials = await this.usersRepository.findCredentialsById(id);

    if (!credentials) {
      throw new NotFoundError(
        "User not found.",

        "USER_NOT_FOUND",
      );
    }

    const matches = await this.passwordHasher.compare(
      dto.currentPassword,

      credentials.passwordHash,
    );

    if (!matches) {
      throw new UnauthorizedError(
        "Current password is incorrect.",

        "INVALID_PASSWORD",
      );
    }

    const isSamePassword = await this.passwordHasher.compare(
      dto.newPassword,
      credentials.passwordHash,
    );

    if (isSamePassword) {
      throw new BadRequestError(
        "New password must be different from the current password.",

        "PASSWORD_NOT_CHANGED",
      );
    }

    const passwordHash = await this.passwordHasher.hash(dto.newPassword);

    const user = await this.usersRepository.updatePassword(
      id,

      passwordHash,
    );

    await this.refreshTokensRepository.delete(id);

    return user;
  }

  async search(currentUserId: string, dto: FindUsersDto): Promise<UserListItem[]> {
    return this.userListRepository.search(currentUserId, dto);
  }

  async uploadAvatar(id: string, file: Buffer): Promise<User> {
    const imageType = detectImageType(file);

    if (!imageType) {
      throw new BadRequestError("Invalid image format.", "INVALID_IMAGE_FORMAT");
    }

    const user = await this.requireById(id);

    const fileName = `${crypto.randomUUID()}.${imageType.extension}`;

    const storedFile = await this.fileStorage.save(file, "avatars", fileName);

    try {
      const updatedUser = await this.usersRepository.updateAvatar(
        id,
        storedFile.url,
        storedFile.publicId,
      );

      if (user.avatarPublicId) {
        try {
          await this.fileStorage.delete(user.avatarPublicId);
        } catch (error) {
          logger.error("Failed to delete old avatar:", error);
        }
      }

      return updatedUser;
    } catch (error) {
      await this.fileStorage.delete(storedFile.publicId);

      throw error;
    }
  }

  async deleteAvatar(id: string): Promise<void> {
    const user = await this.requireById(id);

    if (!user.avatarPublicId) {
      return;
    }

    await this.usersRepository.updateAvatar(id, null, null);

    try {
      await this.fileStorage.delete(user.avatarPublicId);
    } catch (error) {
      logger.error("Failed to delete avatar from storage:", error);
    }
  }
}
