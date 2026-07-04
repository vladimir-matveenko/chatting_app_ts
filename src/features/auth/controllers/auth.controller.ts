import type {
    Request,
    Response,
} from "express";

import { BaseController }
    from "../../../core/http/base.controller.js";

import { AuthMappers }
    from "../mappers/auth.mappers.js";

import { AuthService }
    from "../services/auth.service.js";

import { AuthRequestValidators }
    from "../validators/auth-request.validators.js";
import { AuthResponseDto } from "../dto/response/auth.response.dto.js";

export class AuthController
    extends BaseController {

    constructor(

        private readonly authService: AuthService,

        private readonly validators: AuthRequestValidators,

        private readonly mappers: AuthMappers,

    ) {

        super();

    }

    async register(

        req: Request,

        res: Response<AuthResponseDto>,

    ): Promise<void> {

        const dto =
            this.validators
                .register
                .validate(req);

        const result =
            await this.authService.register(
                dto,
            );

        res.status(201).json(

            this.mappers
                .response
                .map(result),

        );

    }

    async login(

        req: Request,

        res: Response<AuthResponseDto>,

    ): Promise<void> {

        const dto =
            this.validators
                .login
                .validate(req);

        const result =
            await this.authService.login(
                dto,
            );

        res.json(

            this.mappers
                .response
                .map(result),

        );

    }

}