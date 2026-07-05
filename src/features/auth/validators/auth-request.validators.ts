import { LoginRequestValidator } from "./login-request.validator.js";
import type { RefreshTokenRequestValidator }
    from "./refresh-token-request.validator.js";
import { RegisterRequestValidator } from "./register-request.validator.js";

export class AuthRequestValidators {

    constructor(

        readonly login: LoginRequestValidator,

        readonly register: RegisterRequestValidator,

        readonly refresh: RefreshTokenRequestValidator,

    ) { }

}