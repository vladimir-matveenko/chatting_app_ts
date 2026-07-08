import type {
    Database,
} from "../../core/database/database.js";

import type {
    UsersRepository,
} from "../users/repositories/users.repository.js";

import {
    ChatMapper,
} from "./mappers/chats.mapper.js";

import {
    ChatMembersMapper,
} from "./mappers/chat-members.mapper.js";

import {
    CreateChatRequestMapper,
} from "./mappers/create-chat-request.mapper.js";

import {
    ChatsRepository,
} from "./repositories/chats.repository.js";

import {
    ChatMembersRepository,
} from "./repositories/chat-members.repository.js";

import {
    ChatFingerprintService,
} from "./services/chat-fingerprint.service.js";

import {
    ChatsService,
} from "./services/chats.service.js";

import {
    ChatsController,
} from "./controllers/chats.controller.js";

import {
    createChatsRouter,
} from "./routes/chats.routes.js";

import {
    CreateChatRequestValidator,
} from "./validators/create-chat-request.validator.js";

import type {
    ChatsFeature,
} from "./chats.module.interface.js";

import { JwtAuthMiddleware } from "../../core/middleware/jwt-auth.middleware.js";

export function createChatsModule(

    database: Database,

    usersRepository: UsersRepository,

    jwtAuthMiddleware: JwtAuthMiddleware,

): ChatsFeature {

    const chatMapper =
        new ChatMapper();

    const memberMapper =
        new ChatMembersMapper();

    const chatsRepository =
        new ChatsRepository(

            database,

            chatMapper,

        );

    const chatMembersRepository =
        new ChatMembersRepository(

            database,

            memberMapper,

        );

    const fingerprintService =
        new ChatFingerprintService();

    const service =
        new ChatsService(

            database,

            usersRepository,

            chatsRepository,

            chatMembersRepository,

            fingerprintService,

        );

    const validator =
        new CreateChatRequestValidator();

    const mapper =
        new CreateChatRequestMapper();

    const controller =
        new ChatsController(

            service,

            validator,

            mapper,

        );

    const router =
        createChatsRouter(

            controller,

            jwtAuthMiddleware,

        );

    return {

        router,

        controller,

        service,

        repository: chatsRepository,

        mapper: chatMapper,

    };

}