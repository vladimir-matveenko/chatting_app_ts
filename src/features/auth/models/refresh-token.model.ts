export interface RefreshToken {
  userId: string;

  tokenHash: string;

  expiresAt: Date;

  createdAt: Date;

  updatedAt: Date;
}
