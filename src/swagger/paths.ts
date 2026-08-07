import { authPaths } from "../features/auth/swagger/index.js";

import { usersPaths } from "../features/users/swagger/index.js";

import { chatsPaths } from "../features/chats/swagger/index.js";

import { messagesPaths } from "../features/messages/swagger/index.js";

import { healthPaths } from "../features/health/swagger/index.js";
import { NotificationsPaths } from "../features/notifications/swagger/paths/notifications.path.js";

export const paths = {
  ...authPaths,

  ...usersPaths,

  ...chatsPaths,

  ...messagesPaths,

  ...healthPaths,

  ...NotificationsPaths,
};
