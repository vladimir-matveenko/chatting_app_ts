import type { Mapper } from "../../../core/mappers/mapper.js";

import type { UserEntity } from "../entities/user.entity.js";
import type { UserCredentials } from "../models/user-credentials.model.js";

export class UserCredentialsMapper implements Mapper<UserEntity, UserCredentials> {
  map(entity: UserEntity): UserCredentials {
    return {
      id: entity.id,

      email: entity.email,

      passwordHash: entity.password_hash,
    };
  }
}
