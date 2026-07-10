import { ChatsPath } from "./chats.path.js";

import { ChatPath } from "./chat.path.js";

import { ChatMembersPath } from "./chat-members.path.js";

export const chatsPaths = {
  ...ChatsPath,

  ...ChatPath,

  ...ChatMembersPath,
};
