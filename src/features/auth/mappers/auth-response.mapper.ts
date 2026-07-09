import type { Mapper } from "../../../core/mappers/mapper.js";

import type { UserResponseMapper } from "../../users/mappers/user-response.mapper.js";
import { AuthResponseDto } from "../dto/response/auth.response.dto.js";

import type { AuthResult } from "../models/auth-result.model.js";

export class AuthResponseMapper implements Mapper<AuthResult, AuthResponseDto> {
  constructor(private readonly userMapper: UserResponseMapper) {}

  map(model: AuthResult): AuthResponseDto {
    return {
      user: this.userMapper.map(model.user),

      tokens: {
        accessToken: model.accessToken,

        refreshToken: model.refreshToken,
      },
    };
  }
}
