import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

import type { JwtPayload }
    from "./jwt-payload.js";

import type { JwtService }
    from "./jwt-service.js";

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

    verifyAccessToken(
        token: string,
    ): JwtPayload {

        return jwt.verify(

            token,

            env.jwtSecret,

        ) as JwtPayload;

    }

    verifyRefreshToken(
        token: string,
    ): JwtPayload {

        return jwt.verify(

            token,

            env.jwtSecret,

        ) as JwtPayload;

    }

}