import { Mapper } from "../../../core/mappers/mapper.js";
import { PasswordResetCodeEntity } from "../entities/password-reset-code.entity.js";
import { PasswordResetCode } from "../models/password-reset-code.model.js";

export class PasswordResetCodeMapper implements Mapper<PasswordResetCodeEntity, PasswordResetCode> {
  map(entity: PasswordResetCodeEntity): PasswordResetCode {
    return {
      id: entity.id,

      userId: entity.user_id,

      codeHash: entity.code_hash,

      resetTokenHash: entity.reset_token_hash,

      expiresAt: entity.expires_at,

      resetTokenExpiresAt: entity.reset_token_expires_at,

      attempts: entity.attempts,

      verifiedAt: entity.verified_at,

      usedAt: entity.used_at,

      createdAt: entity.created_at,
    };
  }
}
