import type {
    NextFunction,
    Request,
    Response,
} from "express";

import type { JwtService }
    from "../security/jwt-service.js";

import {
    UnauthorizedError,
} from "../errors/index.js";


export class JwtAuthMiddleware {

    constructor(
        private readonly jwtService: JwtService,
    ) { }

    handle(
        req: Request,
        _res: Response,
        next: NextFunction,
    ): void {

        const header =
            req.header(
                "Authorization",
            );

        if (!header) {

            throw new UnauthorizedError(
                "Authorization header is missing.",
                "AUTHORIZATION_HEADER_MISSING",
            );

        }

        if (
            !header.startsWith(
                "Bearer ",
            )
        ) {

            throw new UnauthorizedError(
                "Invalid authorization header.",
                "INVALID_AUTHORIZATION_HEADER",
            );

        }

        const token =
            header.substring(7);

        req.user =
            this.jwtService.verifyAccessToken(
                token,
            );

        next();

    }

}