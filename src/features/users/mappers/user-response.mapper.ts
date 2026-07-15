import type { Mapper } from "../../../core/mappers/mapper.js";

import type { User } from "../models/user.model.js";
import type { UserResponseDto } from "../dto/response/user-response.dto.js";

export class UserResponseMapper implements Mapper<User, UserResponseDto> {
  map(source: User): UserResponseDto {
    return {
      id: source.id,
      userName: source.userName,
      displayName: source.displayName,
      avatarUrl: source.avatarUrl,
      email: source.email,
      createdAt: source.createdAt,
      updatedAt: source.updatedAt,
    };
  }
}
