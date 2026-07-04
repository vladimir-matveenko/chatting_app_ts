import type { JwtPayload } from "./jwt-payload.js";

export interface JwtService {

    signAccessToken(
        payload: JwtPayload,
    ): string;

    signRefreshToken(
        payload: JwtPayload,
    ): string;

    verify(
        token: string,
    ): JwtPayload;

}