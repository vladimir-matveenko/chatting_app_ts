import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

import type { JwtPayload }
    from "./jwt-payload.js";

import type { JwtService }
    from "./jwt-service.js";

import {
    UnauthorizedError,
} from "../errors/index.js";

export class JwtServiceImpl
    implements JwtService {

    signAccessToken(
        payload: JwtPayload,
    ): string {

        return jwt.sign(

            payload,

            env.jwtSecret,

            {

                expiresIn: "15m",

            },

        );

    }

    signRefreshToken(
        payload: JwtPayload,
    ): string {

        return jwt.sign(

            payload,

            env.jwtSecret,

            {

                expiresIn: "30d",

            },

        );

    }

    private mapJwtError(
        error: unknown,
    ): never {

        if (error instanceof Error) {

            switch (error.name) {

                case "TokenExpiredError":

                    throw new UnauthorizedError(
                        "Token has expired.",
                        "TOKEN_EXPIRED",
                    );

                case "JsonWebTokenError":

                    throw new UnauthorizedError(
                        "Invalid token.",
                        "INVALID_TOKEN",
                    );

            }

        }

        throw error;

    }

    private verifyToken(
        token: string,
    ): JwtPayload {

        try {

            return jwt.verify(
                token,
                env.jwtSecret,
            ) as JwtPayload;

        } catch (error) {

            this.mapJwtError(
                error,
            );

        }

    }

    verifyAccessToken(
        token: string,
    ): JwtPayload {

        return this.verifyToken(
            token,
        );

    }

    verifyRefreshToken(
        token: string,
    ): JwtPayload {

        return this.verifyToken(
            token,
        );

    }

}