import { ChatType }
    from "./chat-type.enum.js";

export interface ChatEntity {

    id: string;

    type: ChatType;

    title: string | null;

    avatarUrl: string | null;

    ownerId: string | null;

    createdAt: Date;

    updatedAt: Date;

}