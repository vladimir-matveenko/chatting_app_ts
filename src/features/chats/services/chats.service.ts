import type {
    CreateChatDto,
} from "../dto/create-chat.dto.js";

import { IChatMembersRepository } from "../interfaces/chat-members.repository.interface.js";

import type {
    IChatsRepository,
} from "../interfaces/chats.repository.interface.js";

import { ChatFingerprintService } from "./chat-fingerprint.service.js";

import {
    ChatMemberRole,
} from "../entities/chat-member-role.enum.js";
import { Database } from "../../../core/database/database.js";
import { PoolClient } from "pg";
import { ChatType } from "../entities/chat-type.enum.js";
import { ValidationError } from "../../../core/errors/index.js";
import type {
    IUsersRepository,
} from "../../users/interfaces/users.repository.interface.js";
import { Chat } from "../models/chat.model.js";
import type {
    IChatListRepository,
} from "../interfaces/chat-list.repository.interface.js";
import { ChatListItem } from "../models/chat-list-item.model.js";
import { ChatDetailsMapper } from "../mappers/chat-details.mapper.js";
import { ChatDetails } from "../models/chat-details.model.js";

export class ChatsService {

    constructor(

        private readonly database: Database,

        private readonly usersRepository: IUsersRepository,

        private readonly chatsRepository: IChatsRepository,

        private readonly chatListRepository: IChatListRepository,

        private readonly chatMembersRepository: IChatMembersRepository,

        private readonly fingerprintService: ChatFingerprintService,

        private readonly chatDetailsMapper: ChatDetailsMapper,

    ) { }

    async create(

        dto: CreateChatDto,

    ): Promise<ChatDetails> {

        const memberIds =

            this.normalizeMembers(

                dto.memberIds,

                dto.ownerId,

            );

        await this.validateMembers(
            dto,
            memberIds,
        );

        const normalizedDto: CreateChatDto = {

            ...dto,

            memberIds,

            fingerprint:
                this.fingerprintService.build({

                    ...dto,

                    memberIds,

                }),

        };

        return this.database.transaction(

            async (

                client: PoolClient,

            ) => {

                const existing =
                    await this.chatsRepository.findByFingerprintTx(

                        client,

                        normalizedDto.fingerprint,

                    );

                if (existing) {

                    if (existing) {

                        return this.chatDetailsMapper.map(

                            existing,

                        );

                    }

                }

                const chat =
                    await this.chatsRepository.createTx(

                        client,

                        normalizedDto,

                    );

                await this.createChatMembers(

                    client,

                    chat.id,

                    normalizedDto,

                );

                return this.chatDetailsMapper.map(

                    chat,

                );

            },

        );

    }

    private normalizeMembers(

        memberIds: string[],

        ownerId: string,

    ): string[] {

        const normalized =

            [...new Set(memberIds)];

        if (

            !normalized.includes(ownerId)

        ) {

            normalized.push(ownerId);

        }

        return normalized;

    }

    private async validateMembers(

        dto: CreateChatDto,

        memberIds: string[],

    ): Promise<void> {

        this.validateChatType(
            dto.type,
            memberIds,
        );

        const users =
            await this.usersRepository.findByIds(
                memberIds,
            );

        if (

            users.length !== memberIds.length

        ) {

            throw new ValidationError(

                "One or more users do not exist.",

            );

        }

    }

    private validateChatType(

        type: ChatType,

        memberIds: string[],

    ): void {

        if (

            type === ChatType.PRIVATE

            &&

            memberIds.length !== 2

        ) {

            throw new ValidationError(

                "Private chat must contain exactly two members.",


            );

        }

        if (

            type === ChatType.GROUP

            &&

            memberIds.length < 2

        ) {

            throw new ValidationError(

                "Group chat must contain at least two members.",

            );

        }

    }

    private async createChatMembers(

        client: PoolClient,

        chatId: string,

        dto: CreateChatDto,

    ): Promise<void> {

        for (

            const memberId

            of dto.memberIds

        ) {

            await this.chatMembersRepository.addTx(

                client,

                {

                    chatId,

                    userId: memberId,

                    role:

                        memberId === dto.ownerId

                            ? ChatMemberRole.OWNER

                            : ChatMemberRole.MEMBER,

                },

            );

        }

    }

    async findById(

        id: string,

    ): Promise<Chat | null> {

        return this.chatsRepository.findById(

            id,

        );

    }

    async findByUser(

        userId: string,

    ): Promise<ChatListItem[]> {

        return this.chatListRepository.findByUser(

            userId,

        );

    }

}