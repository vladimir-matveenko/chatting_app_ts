import { UserResponseMapper }
    from "../../users/mappers/user-response.mapper.js";

import { AuthResponseMapper }
    from "./auth-response.mapper.js";

export class AuthMappers {

    readonly response: AuthResponseMapper;

    constructor(
        userResponseMapper: UserResponseMapper,
    ) {

        this.response =
            new AuthResponseMapper(
                userResponseMapper,
            );

    }

}