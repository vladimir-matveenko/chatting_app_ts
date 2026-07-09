import type { RefreshToken } from "../models/refresh-token.model.js";

export interface IRefreshTokensRepository {
  create(userId: string, tokenHash: string, expiresAt: Date): Promise<RefreshToken>;

  findByUserId(userId: string): Promise<RefreshToken | null>;

  update(userId: string, tokenHash: string, expiresAt: Date): Promise<RefreshToken>;

  delete(userId: string): Promise<void>;
}
