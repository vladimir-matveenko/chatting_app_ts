import { BaseRepository } from "../../../core/database/base.repository.js";
import { Database } from "../../../core/database/database.js";
import { PasswordResetCodeEntity } from "../entities/password-reset-code.entity.js";
import { IResetPasswordRepository } from "../interfaces/reset-password.repository.interface.js";
import { PasswordResetCodeMapper } from "../mappers/password-reset-code.mapper.js";
import { PasswordResetCode } from "../models/password-reset-code.model.js";
import { ResetPasswordQueries } from "../queries/reset-password-queries.js";

export class ResetPasswordRepository
  extends BaseRepository<PasswordResetCodeEntity, PasswordResetCode>
  implements IResetPasswordRepository
{
  constructor(db: Database, mapper: PasswordResetCodeMapper) {
    super(db, mapper);
  }

  async invalidatePasswordResetCodes(userId: string): Promise<void> {
    await this.query(ResetPasswordQueries.INVALIDATE_PASSWORD_RESET_CODES, [userId]);
  }

  async createPasswordResetCode(
    userId: string,
    codeHash: string,
    expiresAt: Date,
  ): Promise<PasswordResetCode> {
    return this.saveOne(ResetPasswordQueries.CREATE_PASSWORD_RESET_CODE, [
      userId,
      codeHash,
      expiresAt,
    ]);
  }

  async findPasswordResetCode(userId: string): Promise<PasswordResetCode | null> {
    return this.findOne(ResetPasswordQueries.FIND_PASSWORD_RESET_CODE, [userId]);
  }

  async verifyPasswordResetCode(
    id: string,
    resetTokenHash: string,
    resetTokenExpiresAt: Date,
  ): Promise<PasswordResetCode | null> {
    return this.saveOne(ResetPasswordQueries.VERIFY_PASSWORD_RESET_CODE, [
      id,
      resetTokenHash,
      resetTokenExpiresAt,
    ]);
  }

  async findPasswordResetByToken(resetTokenHash: string): Promise<PasswordResetCode | null> {
    return this.findOne(ResetPasswordQueries.FIND_PASSWORD_RESET_BY_TOKEN, [resetTokenHash]);
  }

  async completePasswordReset(id: string): Promise<void> {
    await this.query(ResetPasswordQueries.COMPLETE_PASSWORD_RESET, [id]);
  }

  async getPasswordResetRequestStats(
    userId: string,
    since: Date,
  ): Promise<{
    requestCount: number;
    lastRequestedAt: Date | null;
  }> {
    const result = await this.db.query(ResetPasswordQueries.GET_PASSWORD_RESET_REQUEST_STATS, [
      userId,
      since,
    ]);

    const row = result.rows[0]!;

    return {
      requestCount: row.request_count,
      lastRequestedAt: row.last_requested_at,
    };
  }
}
