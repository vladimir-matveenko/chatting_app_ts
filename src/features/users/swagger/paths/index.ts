import { getMePath } from "./get-me.path.js";

import { updateMePath } from "./update-me.path.js";

import { updateMePasswordPath } from "./update-me-password.path.js";

import { getUsersPath } from "./get-users.path.js";
import { updateAvatarPath } from "./update-avatar.path.js";

export const usersPaths = {
  ...getMePath,

  ...updateMePath,

  ...updateMePasswordPath,

  ...getUsersPath,

  ...updateAvatarPath,
};
