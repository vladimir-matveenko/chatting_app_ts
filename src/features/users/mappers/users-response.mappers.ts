import { UserResponseMapper } from "./user-response.mapper.js";

export class UsersResponseMappers {

    constructor(
        public readonly user: UserResponseMapper,
    ) { }

}