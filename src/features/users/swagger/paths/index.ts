import { getMePath } from "./get-me.path.js";

import { updateMePath } from "./update-me.path.js";

import { updateMePasswordPath } from "./update-me-password.path.js";

export const usersPaths = {
  ...getMePath,

  ...updateMePath,

  ...updateMePasswordPath,
};
