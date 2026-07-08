import type {
    CreateChatDto,
} from "../dto/create-chat.dto.js";

import type {
    CreateChatRequestDto,
} from "../dto/request/create-chat.request.dto.js";

export class CreateChatRequestMapper {

    map(

        request: CreateChatRequestDto,

        ownerId: string,

    ): CreateChatDto {

        return {

            type:

                request.type,

            title:

                request.title,

            avatarUrl:

                request.avatarUrl,

            memberIds:

                request.memberIds,

            ownerId,

            fingerprint:

                "",

        };

    }

}