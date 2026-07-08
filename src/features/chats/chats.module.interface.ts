import type {
    Router,
} from "express";

import type {
    ChatsController,
} from "./controllers/chats.controller.js";

import type {
    ChatsService,
} from "./services/chats.service.js";

import type {
    ChatsRepository,
} from "./repositories/chats.repository.js";

import type {
    ChatMapper,
} from "./mappers/chats.mapper.js";

export interface ChatsFeature {

    router: Router;

    controller: ChatsController;

    service: ChatsService;

    repository: ChatsRepository;

    mapper: ChatMapper;

}