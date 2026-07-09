import type { Request } from "express";

import type { RequestValidator } from "../../../core/http/request-validator.js";
import { requireEmail } from "../../../core/http/validators/index.js";

import type { GetUserByEmailRequestDto } from "../dto/request/get-user-by-email.request.dto.js";

export class GetUserByEmailRequestValidator implements RequestValidator<GetUserByEmailRequestDto> {
  validate(request: Request): GetUserByEmailRequestDto {
    return {
      email: requireEmail(request.params.email, "email"),
    };
  }
}
