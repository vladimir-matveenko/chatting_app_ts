export interface PasswordResetCodeEntity {
  id: string;
  user_id: string;
  code_hash: string;
  reset_token_hash: string | null;
  expires_at: Date;
  reset_token_expires_at: Date | null;
  attempts: number;
  verified_at: Date | null;
  used_at: Date | null;
  created_at: Date;
}
