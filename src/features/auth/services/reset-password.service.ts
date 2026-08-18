import crypto from "node:crypto";

import { BadRequestError } from "../../../core/errors/index.js";

import { PasswordHasher } from "../../../core/security/password/index.js";
import { TokenHasher } from "../../../core/security/index.js";

import type { IUsersRepository } from "../../users/interfaces/users.repository.interface.js";
import type { IResetPasswordRepository } from "../interfaces/reset-password.repository.interface.js";
import { MailService } from "../../../core/mail/mail.service.js";
import { RequestPasswordResetRequestDto } from "../dto/request/request-password-reset.request.dto.js";

const PASSWORD_RESET_CODE_TTL_MS = 3 * 60 * 1000;

const PASSWORD_RESET_TOKEN_TTL_MS = 10 * 60 * 1000;

const PASSWORD_RESET_MAX_ATTEMPTS = 5; // attempts for one code

export const PASSWORD_RESET_REQUEST_COOLDOWN_MS = 60 * 1000;

export const PASSWORD_RESET_MAX_REQUESTS = 5; // requests count inside REQUEST_WINDOW (5 attempts for 15 min)

export const PASSWORD_RESET_REQUEST_WINDOW_MS = 15 * 60 * 1000;

export class ResetPasswordService {
  constructor(
    private readonly usersRepository: IUsersRepository,

    private readonly resetPasswordRepository: IResetPasswordRepository,

    private readonly passwordHasher: PasswordHasher,

    private readonly tokenHasher: TokenHasher,

    private readonly mailService: MailService,
  ) {}

  async requestCode(dto: RequestPasswordResetRequestDto): Promise<void> {
    const credentials = await this.usersRepository.findCredentialsByEmail(dto.email);

    if (!credentials) {
      return;
    }

    const now = Date.now();

    const requestWindowStartedAt = new Date(now - PASSWORD_RESET_REQUEST_WINDOW_MS);

    const stats = await this.resetPasswordRepository.getPasswordResetRequestStats(
      credentials.id,
      requestWindowStartedAt,
    );

    if (stats.lastRequestedAt) {
      const cooldownEndsAt = stats.lastRequestedAt.getTime() + PASSWORD_RESET_REQUEST_COOLDOWN_MS;

      if (cooldownEndsAt > now) {
        const retryAfterSeconds = Math.ceil((cooldownEndsAt - now) / 1000);

        throw new BadRequestError(
          `Please wait ${retryAfterSeconds} seconds before requesting another reset code.`,
          "RESET_CODE_REQUEST_TOO_SOON",
        );
      }
    }

    if (stats.requestCount >= PASSWORD_RESET_MAX_REQUESTS) {
      throw new BadRequestError(
        `Too many reset code requests. Please try again later.`,
        "RESET_CODE_TOO_MANY_REQUESTS",
      );
    }

    await this.resetPasswordRepository.invalidatePasswordResetCodes(credentials.id);

    const code = this.generateCode();

    const codeHash = this.tokenHasher.hash(code);

    const expiresAt = new Date(Date.now() + PASSWORD_RESET_CODE_TTL_MS);

    await this.resetPasswordRepository.createPasswordResetCode(credentials.id, codeHash, expiresAt);

    await this.mailService.sendPasswordResetCode(dto.email, code);
  }

  async verifyCode(email: string, code: string): Promise<string> {
    const credentials = await this.usersRepository.findCredentialsByEmail(email);

    if (!credentials) {
      throw new BadRequestError("Invalid reset code.", "INVALID_RESET_CODE");
    }

    const resetCode = await this.resetPasswordRepository.findPasswordResetCode(credentials.id);

    if (!resetCode) {
      throw new BadRequestError("Invalid reset code.", "INVALID_RESET_CODE");
    }

    if (resetCode.expiresAt.getTime() <= Date.now()) {
      throw new BadRequestError("Reset code has expired.", "RESET_CODE_EXPIRED");
    }

    if (resetCode.attempts >= PASSWORD_RESET_MAX_ATTEMPTS) {
      throw new BadRequestError("Too many attempts.", "RESET_CODE_TOO_MANY_ATTEMPTS");
    }

    const codeHash = this.tokenHasher.hash(code);

    if (codeHash !== resetCode.codeHash) {
      await this.resetPasswordRepository.incrementPasswordResetAttempts(resetCode.id);

      throw new BadRequestError("Invalid reset code.", "INVALID_RESET_CODE");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const resetTokenHash = this.tokenHasher.hash(resetToken);

    const resetTokenExpiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS);

    const verified = await this.resetPasswordRepository.verifyPasswordResetCode(
      resetCode.id,
      resetTokenHash,
      resetTokenExpiresAt,
    );

    if (!verified) {
      throw new BadRequestError("Invalid reset code.", "INVALID_RESET_CODE");
    }

    return resetToken;
  }

  async resetPassword(resetToken: string, password: string): Promise<void> {
    const resetTokenHash = this.tokenHasher.hash(resetToken);

    const resetCode = await this.resetPasswordRepository.findPasswordResetByToken(resetTokenHash);

    if (!resetCode) {
      throw new BadRequestError("Invalid or expired reset token.", "INVALID_RESET_TOKEN");
    }

    const passwordHash = await this.passwordHasher.hash(password);

    await this.usersRepository.updatePassword(resetCode.userId, passwordHash);

    await this.resetPasswordRepository.completePasswordReset(resetCode.id);
  }

  private generateCode(): string {
    return crypto.randomInt(100000, 1000000).toString();
  }
}
