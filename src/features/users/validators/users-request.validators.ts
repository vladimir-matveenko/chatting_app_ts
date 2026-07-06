import { CreateUserRequestValidator } from "./create-user-request.validator.js";
import { GetUserByEmailRequestValidator } from "./get-user-by-email-request.validator.js";
import { GetUserByIdRequestValidator } from "./get-user-by-id-request.validator.js";
import { GetUserByUsernameRequestValidator } from "./get-user-by-username-request.validator.js";
import { UpdatePasswordRequestValidator } from "./update-password-request.validator.js";
import { UpdateUserRequestValidator } from "./update-user-request.validator.js";

export class UsersRequestValidators {

    constructor(
        public readonly create: CreateUserRequestValidator,
        public readonly getById: GetUserByIdRequestValidator,
        public readonly getByEmail: GetUserByEmailRequestValidator,
        public readonly getByUsername: GetUserByUsernameRequestValidator,
        public readonly update: UpdateUserRequestValidator,
        public readonly updatePassword: UpdatePasswordRequestValidator,
    ) { }

}