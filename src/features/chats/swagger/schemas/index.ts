import {
    ChatSchema,
} from "./chat.schema.js";

import {
    ChatListItemSchema,
} from "./chat-list-item.schema.js";

import {
    CreateChatRequestSchema,
} from "./create-chat-request.schema.js";

export const chatsSchemas = {

    ...ChatSchema,

    ...ChatListItemSchema,

    ...CreateChatRequestSchema,

};