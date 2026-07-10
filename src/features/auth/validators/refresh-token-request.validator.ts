import type { Request } from "express";

import { requireString } from "../../../core/http/validators/index.js";

import type { RequestValidator } from "../../../core/http/request-validator.js";

import type { RefreshTokenRequestDto } from "../dto/request/refresh-token.request.dto.js";

export class RefreshTokenRequestValidator implements RequestValidator<RefreshTokenRequestDto> {
  validate(req: Request): RefreshTokenRequestDto {
    const body = req.body;

    return {
      refreshToken: requireString(body.refreshToken, "refreshToken"),
    };
  }
}
