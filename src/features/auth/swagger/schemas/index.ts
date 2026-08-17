import { AuthResponse } from "./auth-response.schema.js";

import { LoginRequest } from "./login-request.schema.js";

import { RefreshRequest } from "./refresh-request.schema.js";

import { RegisterRequest } from "./register-request.schema.js";
import { RequestPasswordResetRequest } from "./request-password-reset-request.schema.js";
import { ResetPasswordRequest } from "./reset-password-request.schema.js";

import { TokenResponse } from "./token-response.schema.js";
import { VerifyPasswordResetRequest } from "./verify-password-reset-request.schema.js";
import { VerifyPasswordResetResponse } from "./verify-password-reset-response.schema.js";

export const authSchemas = {
  LoginRequest,

  RegisterRequest,

  RefreshRequest,

  TokenResponse,

  AuthResponse,

  RequestPasswordResetRequest,

  VerifyPasswordResetRequest,

  VerifyPasswordResetResponse,

  ResetPasswordRequest,
};
