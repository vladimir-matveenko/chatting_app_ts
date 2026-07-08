import {
    ChatSchema,
} from "./chat.schema.js";

import {
    ChatDetailsSchema,
} from "./chat-details.schema.js";

import {
    ChatListItemSchema,
} from "./chat-list-item.schema.js";

import {
    CreateChatRequestSchema,
} from "./create-chat-request.schema.js";

export const chatsSchemas = {

    ...ChatSchema,

    ...ChatDetailsSchema,

    ...ChatListItemSchema,

    ...CreateChatRequestSchema,

};