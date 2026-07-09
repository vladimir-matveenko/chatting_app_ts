import { buildChatFingerprint } from "../utils/chat-fingerprint.util.js";

import type { CreateChatDto } from "../dto/create-chat.dto.js";

export class ChatFingerprintService {
  build(dto: CreateChatDto): string {
    return buildChatFingerprint({
      type: dto.type,

      ownerId: dto.ownerId,

      title: dto.title,

      avatarUrl: dto.avatarUrl,

      memberIds: dto.memberIds,
    });
  }
}
