import { PasswordResetCode } from "../models/password-reset-code.model.js";

export interface IResetPasswordRepository {
  invalidatePasswordResetCodes(userId: string): Promise<void>;

  createPasswordResetCode(
    userId: string,
    codeHash: string,
    expiresAt: Date,
  ): Promise<PasswordResetCode>;

  findPasswordResetCode(userId: string): Promise<PasswordResetCode | null>;

  incrementPasswordResetAttempts(id: string): Promise<void>;

  verifyPasswordResetCode(
    id: string,
    resetTokenHash: string,
    resetTokenExpiresAt: Date,
  ): Promise<PasswordResetCode | null>;

  findPasswordResetByToken(resetTokenHash: string): Promise<PasswordResetCode | null>;

  completePasswordReset(id: string): Promise<void>;

  getPasswordResetRequestStats(
    userId: string,
    since: Date,
  ): Promise<{
    requestCount: number;
    lastRequestedAt: Date | null;
  }>;
}
