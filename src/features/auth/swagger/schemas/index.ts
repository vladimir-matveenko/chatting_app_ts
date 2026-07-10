import { AuthResponse } from "./auth-response.schema.js";

import { LoginRequest } from "./login-request.schema.js";

import { RefreshRequest } from "./refresh-request.schema.js";

import { RegisterRequest } from "./register-request.schema.js";

import { TokenResponse } from "./token-response.schema.js";

export const authSchemas = {
  LoginRequest,

  RegisterRequest,

  RefreshRequest,

  TokenResponse,

  AuthResponse,
};
