import { LoginRequestValidator }
    from "./login-request.validator.js";

import { RegisterRequestValidator }
    from "./register-request.validator.js";

export class AuthRequestValidators {

    constructor(

        readonly register: RegisterRequestValidator,

        readonly login: LoginRequestValidator,

    ) { }

}