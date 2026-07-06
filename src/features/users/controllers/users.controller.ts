import type {
    Request,
    Response,
} from "express";

import { BaseController } from "../../../core/http/base.controller.js";

import type { UserResponseDto } from "../dto/response/user-response.dto.js";

import { UsersMappers } from "../mappers/users.mappers.js";
import { UsersService } from "../services/users.service.js";
import { UsersRequestValidators } from "../validators/users-request.validators.js";
import { UnauthorizedError } from "../../../core/errors/index.js";

export class UsersController extends BaseController {

    constructor(
        private readonly usersService: UsersService,
        private readonly validators: UsersRequestValidators,
        private readonly mappers: UsersMappers,
    ) {
        super();
    }

    async create(
        req: Request,
        res: Response<UserResponseDto>,
    ): Promise<void> {

        const dto =
            this.validators.create.validate(req);

        const user =
            await this.usersService.createUser(dto);

        this.created(
            res,
            this.mappers.response.map(user),
        );

    }

    async me(
        req: Request,
        res: Response<UserResponseDto>,
    ): Promise<void> {

        if (!req.user) {

            throw new UnauthorizedError(
                "Unauthorized.",
                "UNAUTHORIZED",
            );

        }

        const user =
            await this.usersService.findById(
                req.user.userId,
            );

        res.json(
            this.mappers.response.map(
                user,
            ),
        );

    }

    async getById(
        req: Request,
        res: Response<UserResponseDto>,
    ): Promise<void> {

        const dto =
            this.validators.getById.validate(req);

        const user =
            await this.usersService.requireById(
                dto.id,
            );

        this.ok(
            res,
            this.mappers.response.map(user),
        );

    }

    async getByEmail(
        req: Request,
        res: Response<UserResponseDto>,
    ): Promise<void> {

        const dto =
            this.validators.getByEmail.validate(req);

        const user =
            await this.usersService.getByEmail(
                dto.email,
            );

        this.ok(
            res,
            this.mappers.response.map(user),
        );

    }

    async getByUsername(
        req: Request,
        res: Response<UserResponseDto>,
    ): Promise<void> {

        const dto =
            this.validators.getByUsername.validate(req);

        const user =
            await this.usersService.getByUsername(
                dto.username,
            );

        this.ok(
            res,
            this.mappers.response.map(user),
        );

    }

    async updateMe(

        req: Request,

        res: Response<UserResponseDto>,

    ): Promise<void> {

        if (!req.user) {

            throw new UnauthorizedError(

                "Unauthorized.",

                "UNAUTHORIZED",

            );

        }

        const dto =
            this.validators.update.validate(
                req,
            );

        const user =
            await this.usersService.update(

                req.user.userId,

                dto,

            );

        this.ok(

            res,

            this.mappers.response.map(
                user,
            ),

        );

    }
}