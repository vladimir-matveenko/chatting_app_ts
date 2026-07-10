import { MessagesPaths } from "./messages.path.js";

import { MessageReactionsPath } from "./message-reactions.path.js";

export const messagesPaths = {
  ...MessagesPaths,

  ...MessageReactionsPath,
};
