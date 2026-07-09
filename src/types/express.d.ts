import type { JwtPayload } from "../core/security/jwt/jwt-payload.ts";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
