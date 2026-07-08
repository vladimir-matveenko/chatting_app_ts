import {
    CreateChatPath,
} from "./create-chat.path.js";
import { GetChatsPath } from "./get-chats.path.js";

export const chatsPaths = {

    ...GetChatsPath,
    
    ...CreateChatPath,

};