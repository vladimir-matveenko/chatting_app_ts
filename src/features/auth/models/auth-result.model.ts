import type { User } from "../../users/models/user.model.js";

export interface AuthResult {

    accessToken: string;

    refreshToken: string;

    user: User;

}