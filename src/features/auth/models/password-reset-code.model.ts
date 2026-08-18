export interface PasswordResetCode {
  id: string;
  userId: string;
  codeHash: string;
  resetTokenHash: string | null;
  expiresAt: Date;
  resetTokenExpiresAt: Date | null;
  attempts: number;
  verifiedAt: Date | null;
  usedAt: Date | null;
  createdAt: Date;
}
