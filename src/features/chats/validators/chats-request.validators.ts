import { TransferOwnershipRequestValidator } from "../dto/transfer-ownership-request.validator.js";
import { AddChatMembersRequestValidator } from "./add-chat-members-request.validator.js";
import { ArchiveChatRequestValidator } from "./archive-chat-request.validator.js";
import { ChangeMemberRoleRequestValidator } from "./change-member-role-request.validator.js";
import { CreateChatRequestValidator } from "./create-chat-request.validator.js";
import { FindChatsRequestValidator } from "./find-chats.request.validator.js";
import { MuteChatRequestValidator } from "./mute-chat-request.validator.js";
import { UpdateChatRequestValidator } from "./update-chat-request.validator.js";

export class ChatsRequestValidators {
  constructor(
    public readonly create: CreateChatRequestValidator,
    public readonly update: UpdateChatRequestValidator,
    public readonly findChats: FindChatsRequestValidator,
    public readonly addMembers: AddChatMembersRequestValidator,
    public readonly changeRole: ChangeMemberRoleRequestValidator,
    public readonly transferOwnership: TransferOwnershipRequestValidator,
    public readonly archive: ArchiveChatRequestValidator,
    public readonly mute: MuteChatRequestValidator,
  ) {}
}
