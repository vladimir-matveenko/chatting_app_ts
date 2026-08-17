import { RequestPasswordResetRequestValidator } from "./request-password-reset.validator.js";
import { ResetPasswordRequestValidator } from "./reset-password-request.validator.js";
import { VerifyPasswordResetRequestValidator } from "./verify-password-reset-request.validator.js";

export class ResetPasswordRequestValidators {
  constructor(
    readonly request: RequestPasswordResetRequestValidator,

    readonly verify: VerifyPasswordResetRequestValidator,

    readonly reset: ResetPasswordRequestValidator,
  ) {}
}
