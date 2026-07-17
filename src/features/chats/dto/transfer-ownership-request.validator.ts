import type { Request } from "express";

import type { RequestValidator } from "../../../core/http/request-validator.js";

import { requireId } from "../../../core/http/validators/index.js";
import { TransferOwnershipRequestDto } from "./request/transfer-ownership-request.dto.js";

export class TransferOwnershipRequestValidator implements RequestValidator<TransferOwnershipRequestDto> {
  validate(request: Request): TransferOwnershipRequestDto {
    return {
      userId: requireId(
        request.body.userId,

        "userId",
      ),
    };
  }
}
