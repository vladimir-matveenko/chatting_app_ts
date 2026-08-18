import { loginPath } from "./login.path.js";

import { logoutPath } from "./logout.path.js";

import { refreshPath } from "./refresh.path.js";

import { registerPath } from "./register.path.js";
import { resetPasswordPath } from "./reset-password.path.js";

export const authPaths = {
  ...loginPath,

  ...logoutPath,

  ...refreshPath,

  ...registerPath,

  ...resetPasswordPath,
};
