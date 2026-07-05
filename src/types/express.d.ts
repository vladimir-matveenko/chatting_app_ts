import type { JwtPayload }
    from "../core/security/jwt-payload.js";

declare global {

    namespace Express {

        interface Request {

            user?: JwtPayload;

        }

    }

}

export { };