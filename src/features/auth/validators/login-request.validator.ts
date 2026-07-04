import type { Request } from "express";

import type { RequestValidator }
    from "../../../core/http/request-validator.js";

import {
    requireEmail,
    requirePassword,
} from "../../../core/http/validators/index.js";

import type {
    LoginRequestDto,
} from "../dto/request/login.request.dto.js";

export class LoginRequestValidator
    implements RequestValidator<LoginRequestDto> {

    validate(
        request: Request,
    ): LoginRequestDto {

        return {

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