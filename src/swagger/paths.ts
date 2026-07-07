import {
    authPaths,
} from "../features/auth/swagger/index.js";

import {
    usersPaths,
} from "../features/users/swagger/index.js";

export const paths = {

    ...authPaths,

    ...usersPaths,

};