import type { Request } from "express";

import type { RequestValidator }
    from "../../../core/http/request-validator.js";

import {
    requireEmail,
    requirePassword,
    requireUsername,
} from "../../../core/http/validators/index.js";

import type {
    RegisterRequestDto,
} from "../dto/request/register.request.dto.js";

export class RegisterRequestValidator
    implements RequestValidator<RegisterRequestDto> {

    validate(
        request: Request,
    ): RegisterRequestDto {

        return {

            username: requireUsername(
                request.body.username,
            ),

            email: requireEmail(
                request.body.email,
                "email",
            ),

            password: requirePassword(
                request.body.password,
            ),

        };

    }

}