import {
    ChatSchema,
} from "./chat.schema.js";

import {
    CreateChatRequestSchema,
} from "./create-chat-request.schema.js";

export const chatsSchemas = {

    ...ChatSchema,

    ...CreateChatRequestSchema,

};