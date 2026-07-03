import type {
    Request,
    Response,
} from "express";
import { UserResponseDto } from "../dto/response/user-response.dto.js";
import { UsersResponseMappers } from "../mappers/users-response.mappers.js";
import { UsersService } from "../services/users.service.js";
import { UsersRequestValidators } from "../validators/users-request.validators.js";


export class UsersController {

    constructor(
        private readonly usersService: UsersService,
        private readonly validators: UsersRequestValidators,
        private readonly responseMappers: UsersResponseMappers,
    ) { }

    async create(
        req: Request,
        res: Response<UserResponseDto>,
    ): Promise<void> {

        const dto =
            this.validators.create.validate(req);

        const user =
            await this.usersService.create(dto);

        res.status(201).json(
            this.responseMappers.user.map(user),
        );

    }

    async getById(
        req: Request,
        res: Response<UserResponseDto>,
    ): Promise<void> {

        const dto =
            this.validators.getById.validate(req);

        const user =
            await this.usersService.requireById(dto.id);

        res.json(
            this.responseMappers.user.map(user),
        );

    }

    async getByEmail(
        req: Request,
        res: Response<UserResponseDto>,
    ): Promise<void> {

        const dto =
            this.validators.getByEmail.validate(req);

        const user =
            await this.usersService.getByEmail(dto.email);

        res.json(
            this.responseMappers.user.map(user),
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

        res.json(
            this.responseMappers.user.map(user),
        );

    }

}