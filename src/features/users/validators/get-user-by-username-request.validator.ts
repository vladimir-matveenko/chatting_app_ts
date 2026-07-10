import type { Request } from "express";

import type { RequestValidator } from "../../../core/http/request-validator.js";
import { requireString } from "../../../core/http/validators/index.js";

import type { GetUserByUsernameRequestDto } from "../dto/request/get-user-by-username.request.dto.js";

export class GetUserByUsernameRequestValidator implements RequestValidator<GetUserByUsernameRequestDto> {
  validate(request: Request): GetUserByUsernameRequestDto {
    return {
      username: requireString(request.params.username, "username"),
    };
  }
}
