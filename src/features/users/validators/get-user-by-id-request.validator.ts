import type { Request } from "express";

import type { RequestValidator } from "../../../core/http/request-validator.js";

import { requireUuid } from "../../../core/http/validators/index.js";

import type { GetUserByIdRequestDto } from "../dto/request/get-user-by-id.request.dto.js";
import { requireId } from "../../../core/http/validators/id.validator.js";

export class GetUserByIdRequestValidator
    implements RequestValidator<GetUserByIdRequestDto> {
    validate(
        request: Request,
    ): GetUserByIdRequestDto {

        return {

            id: requireId(
                request.params.id,
                "id",
            ),

        };

    }
}